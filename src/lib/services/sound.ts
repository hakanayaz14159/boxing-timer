import boxBellUrl from '$lib/assets/box_bell.mp3?url';

export type BellSignal = 'round' | 'workout_complete';

/**
 * box_bell.mp3 holds three separate single-strike takes (onsets at 0.12s, 9.34s
 * and 17.88s). The third has the longest tail, so it is the one we play.
 */
const STRIKE_OFFSET_SECONDS = 17.8;
const STRIKE_LENGTH_SECONDS = 2.8;

/** A finished workout rings three times, the boxing convention for "that's it". */
const COMPLETE_STRIKE_COUNT = 3;
const COMPLETE_STRIKE_GAP_SECONDS = 0.85;

/** The asset peaks at -4.5 dBFS, so this lands a single strike just under 0 dBFS. */
const BELL_GAIN = 1.5;

const WARNING_BEEP_FREQ_HZ = 880;
const WARNING_BEEP_SECONDS = 0.18;
const WARNING_BEEP_GAIN = 0.35;

let audioContext: AudioContext | null = null;
let limiter: DynamicsCompressorNode | null = null;
let bellBuffer: AudioBuffer | null = null;
let bellBufferRequest: Promise<AudioBuffer> | null = null;

function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	return audioContext;
}

/**
 * Overlapping bell tails would otherwise exceed 0 dBFS and clip, so everything
 * routes through a shared limiter rather than straight to the destination.
 */
function getOutputNode(ctx: AudioContext): AudioNode {
	if (!limiter) {
		limiter = ctx.createDynamicsCompressor();
		limiter.threshold.value = -2;
		limiter.knee.value = 0;
		limiter.ratio.value = 20;
		limiter.attack.value = 0.002;
		limiter.release.value = 0.15;
		limiter.connect(ctx.destination);
	}
	return limiter;
}

function loadBellBuffer(ctx: AudioContext): Promise<AudioBuffer> {
	if (bellBuffer) return Promise.resolve(bellBuffer);
	bellBufferRequest ??= fetch(boxBellUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Bell request failed with status ${response.status}`);
			}
			return response.arrayBuffer();
		})
		.then((data) => ctx.decodeAudioData(data))
		.then((buffer) => {
			bellBuffer = buffer;
			return buffer;
		})
		.catch((error: unknown) => {
			bellBufferRequest = null;
			throw error;
		});
	return bellBufferRequest;
}

async function resumeContext(ctx: AudioContext): Promise<void> {
	if (ctx.state === 'suspended') {
		await ctx.resume();
	}
}

/**
 * Must be called from a user gesture: mobile browsers only allow an AudioContext
 * to leave the suspended state in response to one.
 */
export async function preloadBell(): Promise<void> {
	try {
		const ctx = getAudioContext();
		await resumeContext(ctx);
		await loadBellBuffer(ctx);
	} catch (error) {
		console.warn('[sound] Bell preload failed', error);
	}
}

function scheduleStrike(ctx: AudioContext, buffer: AudioBuffer, at: number): void {
	const available = buffer.duration - STRIKE_OFFSET_SECONDS;
	if (available <= 0) {
		console.warn('[sound] Bell asset is shorter than the expected strike offset');
		return;
	}

	const gain = ctx.createGain();
	gain.gain.value = BELL_GAIN;
	gain.connect(getOutputNode(ctx));

	const source = ctx.createBufferSource();
	source.buffer = buffer;
	source.connect(gain);
	source.start(at, STRIKE_OFFSET_SECONDS, Math.min(STRIKE_LENGTH_SECONDS, available));
}

export async function playBell(signal: BellSignal): Promise<void> {
	try {
		const ctx = getAudioContext();
		await resumeContext(ctx);
		const buffer = await loadBellBuffer(ctx);
		const strikes = signal === 'workout_complete' ? COMPLETE_STRIKE_COUNT : 1;

		// Scheduled on the audio clock so the sequence survives timer throttling.
		for (let i = 0; i < strikes; i++) {
			scheduleStrike(ctx, buffer, ctx.currentTime + i * COMPLETE_STRIKE_GAP_SECONDS);
		}
	} catch (error) {
		console.warn('[sound] Bell playback failed', error);
	}
}

export async function playWarningBeep(): Promise<void> {
	try {
		const ctx = getAudioContext();
		await resumeContext(ctx);

		const gain = ctx.createGain();
		gain.gain.setValueAtTime(WARNING_BEEP_GAIN, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + WARNING_BEEP_SECONDS);
		gain.connect(getOutputNode(ctx));

		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.value = WARNING_BEEP_FREQ_HZ;
		osc.connect(gain);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + WARNING_BEEP_SECONDS);
	} catch (error) {
		console.warn('[sound] Warning beep failed', error);
	}
}
