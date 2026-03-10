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

	const isPaused = $derived(timerStore.isPaused);
	const showPaused = $derived(
		isPaused && (timerStore.phase === 'exercise' || timerStore.phase === 'rest')
	);
</script>

<div class="countdown" aria-live="polite" aria-atomic="true">
	{#if showPaused}
		<span class="paused-badge" aria-live="polite">Paused</span>
	{/if}
	<span class="display">{displayText}</span>
</div>

<style>
	.countdown {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 0;
		min-width: 0;
		text-align: center;
		padding: 0.5rem;
		container-type: size;
		container-name: countdown;
	}

	/* Size from container so "Start" (5 chars) fits. Monospace ~0.6em/char => 5 chars ≈ 3em => font-size = 33cqw for full width */
	.display {
		font-size: min(20cqw, 28cqh);
		font-weight: 700;
		line-height: 1;
		color: var(--color-text, #111);
		font-family: var(--font-display, system-ui, sans-serif);
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.countdown {
			padding: 0.25rem;
		}

		.display {
			font-size: min(18cqw, 25cqh);
		}

		.paused-badge {
			font-size: clamp(0.875rem, 3vw, 1rem);
			padding: 0.375rem 0.75rem;
		}
	}

	.paused-badge {
		position: absolute;
		top: 0.5rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.5rem 1rem;
		font-size: clamp(1rem, 4vw, 1.375rem);
		font-weight: 700;
		font-family: var(--font-body);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text);
		background: var(--color-bg-input);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		animation: fadeIn 0.2s ease forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
