<script lang="ts">
	import TimerControls from '$lib/components/TimerControls.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { localeStore, locale } from '$lib/i18n';

	const t = localeStore.t.bind(localeStore);
	$locale;
	const phase = $derived(timerStore.phase);
	const phaseLabel = $derived.by(() => {
		if (phase === 'exercise') return t('timer.exercise');
		if (phase === 'rest') return t('timer.rest');
		if (phase === 'countdown') return t('timer.getReady');
		if (phase === 'finished') return t('timer.workoutComplete');
		return '';
	});
	const showRound = $derived(phase === 'exercise' || phase === 'rest');
</script>

<div class="overlay">
	<div class="top-info">
		{#if phaseLabel}
			<span class="phase-label">{phaseLabel}</span>
		{/if}
		{#if showRound}
			<span class="round">
				{t('timer.round', {
					current: timerStore.currentRound,
					total: timerStore.activeConfig.rounds
				})}
			</span>
		{/if}
	</div>
	<div class="controls-wrapper">
		<TimerControls />
	</div>
</div>

<style>
	.overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: calc(5rem + env(safe-area-inset-top, 0)) 1.5rem calc(2rem + env(safe-area-inset-bottom, 0));
	}

	.overlay > * {
		pointer-events: auto;
	}

	.top-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.phase-label {
		font-size: clamp(0.875rem, 2.5vw, 1.25rem);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.round {
		font-size: clamp(1.25rem, 4vw, 2rem);
		font-weight: 700;
		font-family: var(--font-display, system-ui, sans-serif);
		color: var(--color-text);
	}

	.controls-wrapper {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.controls-wrapper :global(.controls) {
		flex-direction: row;
		width: 100%;
		max-width: 24rem;
		gap: 0.875rem;
	}

	.controls-wrapper :global(.btn) {
		min-height: 64px;
		font-size: 1.25rem;
		padding: 1rem 1.5rem;
	}

	@media (max-width: 640px) and (orientation: portrait) {
		.overlay {
			padding: calc(5rem + env(safe-area-inset-top, 0)) 0.75rem
				calc(1.5rem + env(safe-area-inset-bottom, 0));
		}

		.controls-wrapper :global(.controls) {
			max-width: none;
			flex-direction: row;
			justify-content: flex-end;
			gap: 1rem;
		}

		.controls-wrapper :global(.btn) {
			min-height: 72px;
			font-size: 1.375rem;
			padding: 1rem 1.5rem;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.overlay {
			padding: calc(3rem + env(safe-area-inset-top, 0)) 1rem
				calc(0.75rem + env(safe-area-inset-bottom, 0));
		}

		.controls-wrapper :global(.controls) {
			max-width: none;
			flex-direction: row;
			gap: 0.75rem;
			justify-content: flex-end;
		}

		.controls-wrapper :global(.btn) {
			min-height: 56px;
			font-size: 1.125rem;
			padding: 0.75rem 1.25rem;
		}
	}
</style>
