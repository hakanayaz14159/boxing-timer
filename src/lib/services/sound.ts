import boxBellUrl from '$lib/assets/box_bell.mp3?url';

/**
 * Boxing bell segments in box_bell.mp3:
 * - 1 bell: 00:00 (round end)
 * - 2 bells: 00:09 (reserved)
 * - 3 bells: 00:17 (workout complete)
 * Play duration: 5 seconds from each start point.
 */
export type BellSignal = 'round_end' | 'workout_complete';

const BELL_OFFSETS: Record<BellSignal, number> = {
	round_end: 0, // 1 bell at 00:00
	workout_complete: 17 // 3 bells at 00:17
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

		const source = ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(ctx.destination);
		source.start(ctx.currentTime, offset, Math.min(PLAY_DURATION, buffer.duration - offset));
	} catch (err) {
		console.warn('[sound] Failed to play alarm:', err);
	}
}
