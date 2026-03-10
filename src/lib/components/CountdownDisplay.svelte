<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';
	import { configStore } from '$lib/stores/config.svelte';

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
</script>

<div class="countdown" aria-live="polite" aria-atomic="true">
	{#if phaseLabel}
		<span class="phase-label">{phaseLabel}</span>
	{/if}
	<span class="display">{displayText}</span>
	{#if timerStore.phase === 'exercise' || timerStore.phase === 'rest'}
		<span class="round">Round {timerStore.currentRound} / {configStore.value.rounds}</span>
	{/if}
</div>

<style>
	.countdown {
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
		font-size: clamp(4rem, 20vw, 12rem);
		font-weight: 700;
		line-height: 1;
		color: var(--color-text, #111);
		font-family: var(--font-display, system-ui, sans-serif);
	}

	.round {
		font-size: clamp(0.875rem, 2.5vw, 1rem);
		color: var(--color-text-muted, #666);
	}
</style>
