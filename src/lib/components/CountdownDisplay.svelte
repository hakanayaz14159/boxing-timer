<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';

	const displayText = $derived.by(() => {
		const phase = timerStore.phase;
		if (phase === 'countdown') {
			return String(timerStore.countdownDisplay);
		}
		if (phase === 'exercise' || phase === 'rest') {
			return String(timerStore.remainingSeconds);
		}
		if (phase === 'finished') {
			return 'Done';
		}
		return '';
	});

	const phaseLabel = $derived.by(() => {
		const phase = timerStore.phase;
		if (phase === 'exercise') return 'Exercise';
		if (phase === 'rest') return 'Rest';
		if (phase === 'countdown') return 'Get Ready';
		if (phase === 'finished') return 'Workout Complete';
		return '';
	});

	const isPaused = $derived(timerStore.isPaused);
	const showPaused = $derived(
		isPaused && (timerStore.phase === 'exercise' || timerStore.phase === 'rest')
	);
</script>

<div class="countdown" aria-live="polite" aria-atomic="true">
	{#if showPaused}
		<div class="paused-overlay" aria-live="polite">
			<span class="paused-backdrop"></span>
			<span class="paused-text">Paused</span>
		</div>
	{/if}
	{#if phaseLabel}
		<span class="phase-label">{phaseLabel}</span>
	{/if}
	<span class="display">{displayText}</span>
	{#if timerStore.phase === 'exercise' || timerStore.phase === 'rest'}
		<span class="round">Round {timerStore.currentRound} / {timerStore.activeConfig.rounds}</span>
	{/if}
</div>

<style>
	.countdown {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 0.5rem;
		text-align: center;
		padding: 1rem;
	}

	.phase-label {
		font-size: clamp(0.875rem, 3vw, 1.25rem);
		color: var(--color-text-muted, #666);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.display {
		font-size: clamp(3rem, min(20vw, 15vh), 12rem);
		font-weight: 700;
		line-height: 1;
		color: var(--color-text, #111);
		font-family: var(--font-display, system-ui, sans-serif);
	}

	.round {
		font-size: clamp(1.5rem, 6vw, 3.5rem);
		font-weight: 700;
		font-family: var(--font-display, system-ui, sans-serif);
		color: var(--color-text);
		letter-spacing: 0.02em;
	}

	.paused-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		user-select: none;
	}

	.paused-backdrop {
		position: absolute;
		inset: 0;
		background: var(--color-bg);
		opacity: 0.85;
	}

	.paused-text {
		position: relative;
		font-size: clamp(3rem, 15vw, 8rem);
		font-weight: 700;
		font-family: var(--font-display, system-ui, sans-serif);
		color: var(--color-text);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
</style>
