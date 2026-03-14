import boxBellUrl from '$lib/assets/box_bell.mp3?url';

/**
 * Boxing bell segments in box_bell.mp3:
 * - 1 bell: 00:00
 * - 2 bells: 00:09
 * - 3 bells: 00:17
 * All notifications use 3 bells. Play duration: 5 seconds from start point.
 */
export type BellSignal = 'round_end' | 'workout_complete';

const THREE_BELLS_OFFSET = 17;

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

/**
 * Preloads the bell audio on user gesture (e.g. Start click). Call this before
 * the first bell to ensure the buffer is ready and AudioContext is resumed.
 * Handles errors internally.
 */
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

/**
 * Plays the alarm sound for the given signal. Handles errors internally to avoid
 * unhandled promise rejections when called fire-and-forget.
 */
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
