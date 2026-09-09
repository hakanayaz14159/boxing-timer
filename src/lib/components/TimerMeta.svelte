<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';
	import { t } from '$lib/i18n/locale.svelte';

	let phase = $derived(timerStore.phase);
	let showRound = $derived(phase === 'exercise' || phase === 'rest');

	/**
	 * Exercise and rest are conveyed by the background colour alone; text is only
	 * shown where colour has nothing to say, before the first round and after the last.
	 */
	let label = $derived.by(() => {
		switch (phase) {
			case 'countdown':
				return t('timer.getReady');
			case 'finished':
				return t('timer.workoutComplete');
			case 'config':
			case 'exercise':
			case 'rest':
				return '';
			default: {
				const unhandled: never = phase;
				throw new Error(`Unhandled phase: ${String(unhandled)}`);
			}
		}
	});

	let roundLabel = $derived(
		t('timer.round', { current: timerStore.currentRound, total: timerStore.totalRounds })
	);

	/**
	 * The only live region in the app, and the only place the phase is still named:
	 * a screen reader cannot see the colour. Changes on phase, round and pause only.
	 */
	let announcement = $derived.by(() => {
		const parts: string[] = [];
		if (showRound) {
			parts.push(roundLabel);
			parts.push(phase === 'exercise' ? t('timer.exercise') : t('timer.rest'));
		} else if (label) {
			parts.push(label);
		}
		if (timerStore.isPaused) parts.push(t('timer.paused'));
		return parts.join('. ');
	});
</script>

<div class="meta" aria-hidden="true">
	{#if timerStore.isPaused}
		<span class="paused">{t('timer.paused')}</span>
	{/if}

	{#if showRound}
		<span class="round">
			<span class="caption">{t('timer.roundCaption')}</span>
			{timerStore.currentRound} / {timerStore.totalRounds}
		</span>
	{:else if label}
		<span class="label">{label}</span>
	{/if}
</div>

<div class="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>

<style>
	/* Takes the header row while a workout runs, in place of the theme and
	   language controls, which have no business on screen mid-round. */
	.meta {
		grid-area: header;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: flex-end;
		gap: var(--sp-2) var(--sp-4);
		min-width: 0;
		padding-top: env(safe-area-inset-top, 0);
		color: var(--color-text);
	}

	/* Sized to be read from across a gym, not from arm's length. */
	.round {
		display: inline-flex;
		align-items: baseline;
		gap: var(--sp-3);
		font-family: var(--font-display);
		font-size: clamp(3.25rem, 12vmin, 7.5rem);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 0.9;
		letter-spacing: -0.04em;
	}

	.caption {
		font-family: var(--font-body);
		font-size: clamp(0.875rem, 2.5vmin, 1.25rem);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.label {
		font-size: clamp(1.25rem, 4vmin, 2rem);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.paused {
		padding: var(--sp-1) var(--sp-3);
		font-size: var(--text-sm);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-bg);
		background: var(--color-text);
		border-radius: var(--radius-pill);
	}
</style>
