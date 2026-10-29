<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';
	import { t } from '$lib/i18n/locale.svelte';
	import { splitClock } from '$lib/utils/format';

	let phase = $derived(timerStore.phase);
	let clock = $derived(splitClock(timerStore.remainingSeconds));

	let showClock = $derived(phase === 'exercise' || phase === 'rest');

	/** A word rather than a clock: the countdown lead-in, or the finish notice. */
	let word = $derived.by(() => {
		if (phase === 'countdown') {
			return timerStore.countdownStep === 'go' ? t('timer.go') : String(timerStore.countdownStep);
		}
		return phase === 'finished' ? t('timer.done') : '';
	});
	let progress = $derived(showClock ? timerStore.segmentProgress : 0);
</script>

<div class="clock" class:clock--paused={timerStore.isPaused}>
	<!-- Digits are decorative for assistive tech: TimerMeta announces phase changes
	     instead, so a screen reader is not read a new number every second. -->
	<div class="readout" aria-hidden="true">
		{#if showClock}
			<span class="pair">{clock.minutes.toString().padStart(2, '0')}</span>
			<span class="sep">:</span>
			<span class="pair">{clock.secs.toString().padStart(2, '0')}</span>
		{:else if word}
			<span class="word" style:--chars={word.length}>{word}</span>
		{/if}
	</div>

	{#if showClock}
		<div class="progress-block">
			<div class="wordmark" aria-hidden="true">AHMET TAŞÇI</div>
			<div class="progress" style:--progress={progress}></div>
		</div>
	{/if}
</div>

<style>
	.clock {
		container-type: size;
		container-name: clock;
		position: relative;
		display: grid;
		grid-template-rows: 1fr auto;
		align-items: center;
		justify-items: center;
		min-height: 0;
		width: 100%;
		height: 100%;
	}

	/*
	 * Stacked by default. Two glyphs per line instead of five means the size is no
	 * longer capped by the width of "MM:SS", which is what kept portrait phones at
	 * roughly a seventh of the screen height.
	 */
	.readout {
		display: grid;
		place-items: center;
		min-height: 0;
		font-family: var(--font-display);
		font-size: min(80cqw, 54cqh);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 0.85;
		letter-spacing: -0.02em;
		color: var(--color-text);
	}

	.sep {
		display: none;
	}

	/*
	 * Scaled by character count, because these words differ per locale: the
	 * countdown ends on "GO" in English but "BAŞLA" in Turkish, and a fixed
	 * size that fits one overflows the other.
	 */
	.word {
		font-size: min(calc(150cqw / var(--chars, 1)), 70cqh);
		text-transform: uppercase;
	}

	/* Wide enough to sit side by side, e.g. landscape phones and desktops. */
	@container clock (min-aspect-ratio: 1 / 1) {
		.readout {
			grid-auto-flow: column;
			font-size: min(31cqw, 78cqh);
		}

		.sep {
			display: block;
		}
	}

	.clock--paused .readout {
		opacity: 0.5;
	}

	.progress-block {
		display: grid;
		justify-items: center;
		justify-self: stretch;
		gap: var(--sp-2);
		width: 100%;
	}

	.wordmark {
		font-size: clamp(1rem, 4vmin, 1.75rem);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-align: center;
		color: var(--color-text-muted);
	}

	@media (max-height: 500px) {
		.wordmark {
			font-size: var(--text-sm);
			letter-spacing: 0.12em;
		}
	}

	.progress {
		width: 100%;
		height: 0.5rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--color-text) 18%, transparent);
		overflow: hidden;
	}

	.progress::after {
		content: '';
		display: block;
		height: 100%;
		width: calc(var(--progress) * 100%);
		border-radius: inherit;
		background: var(--color-text);
		opacity: 0.9;
		transition: width var(--motion-tick) linear;
	}

	.clock--paused .progress::after {
		transition: none;
	}
</style>
