let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	return audioContext;
}

export async function playBeep(): Promise<void> {
	const ctx = getAudioContext();
	if (ctx.state === 'suspended') {
		await ctx.resume();
	}

	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();

	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(800, ctx.currentTime);
	oscillator.connect(gain);
	gain.connect(ctx.destination);

	gain.gain.setValueAtTime(0.3, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

	oscillator.start(ctx.currentTime);
	oscillator.stop(ctx.currentTime + 0.3);
}
