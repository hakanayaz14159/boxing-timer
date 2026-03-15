import boxBellUrl from '$lib/assets/box_bell.mp3?url';

export type BellSignal = 'round_end' | 'workout_complete';

const THREE_BELLS_OFFSET = 17.5;

const BELL_OFFSETS: Record<BellSignal, number> = {
	round_end: THREE_BELLS_OFFSET,
	workout_complete: THREE_BELLS_OFFSET
};

const PLAY_DURATION = 5;

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	return audioContext;
}

async function loadAudioBuffer(ctx: AudioContext): Promise<AudioBuffer> {
	if (audioBuffer) return audioBuffer;
	const response = await fetch(boxBellUrl);
	const arrayBuffer = await response.arrayBuffer();
	audioBuffer = await ctx.decodeAudioData(arrayBuffer);
	return audioBuffer;
}

export async function preloadBell(): Promise<void> {
	try {
		const ctx = getAudioContext();
		if (ctx.state === 'suspended') {
			await ctx.resume();
		}
		await loadAudioBuffer(ctx);
	} catch (err) {
		console.warn('[sound] Failed to preload bell:', err);
	}
}

export async function playAlarm(signal: BellSignal): Promise<void> {
	try {
		const ctx = getAudioContext();
		if (ctx.state === 'suspended') {
			await ctx.resume();
		}

		const buffer = await loadAudioBuffer(ctx);
		const offset = BELL_OFFSETS[signal];

		const gainNode = ctx.createGain();
		gainNode.gain.value = 3;
		gainNode.connect(ctx.destination);

		const source = ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(gainNode);
		source.start(ctx.currentTime, offset, Math.min(PLAY_DURATION, buffer.duration - offset));
	} catch (err) {
		console.warn('[sound] Failed to play alarm:', err);
	}
}

const TEN_SECOND_BEEP_FREQ = 880;
const TEN_SECOND_BEEP_DURATION_MS = 180;
const TEN_SECOND_BEEP_GAIN = 0.9;

export async function playTenSecondWarning(): Promise<void> {
	try {
		const ctx = getAudioContext();
		if (ctx.state === 'suspended') {
			await ctx.resume();
		}

		const gainNode = ctx.createGain();
		gainNode.gain.setValueAtTime(TEN_SECOND_BEEP_GAIN, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + TEN_SECOND_BEEP_DURATION_MS / 1000);
		gainNode.connect(ctx.destination);

		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.value = TEN_SECOND_BEEP_FREQ;
		osc.connect(gainNode);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + TEN_SECOND_BEEP_DURATION_MS / 1000);
	} catch (err) {
		console.warn('[sound] Failed to play 10-second warning:', err);
	}
}
