<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';

	const phase = $derived(timerStore.phase);
	const isPaused = $derived(timerStore.isPaused);

	const canStart = $derived(phase === 'config' || phase === 'ready');
	const canPauseResume = $derived(phase === 'exercise' || phase === 'rest');
	const canReset = $derived(
		phase === 'countdown' || phase === 'exercise' || phase === 'rest' || phase === 'finished'
	);
</script>

<div class="controls">
	{#if canStart}
		<button type="button" class="btn btn-primary" onclick={() => timerStore.start()}>
			Start
		</button>
	{/if}
	{#if canPauseResume}
		<button type="button" class="btn btn-secondary" onclick={() => timerStore.togglePause()}>
			{isPaused ? 'Resume' : 'Pause'}
		</button>
	{/if}
	{#if canReset}
		<button type="button" class="btn btn-outline" onclick={() => timerStore.reset()}>
			Reset
		</button>
	{/if}
</div>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		align-items: stretch;
		width: 100%;
	}

	.btn {
		flex: 1;
		min-width: 0;
		min-height: 48px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: var(--radius-md);
		cursor: pointer;
		border: none;
		transition:
			opacity 0.15s,
			transform 0.1s,
			background 0.15s;
	}

	.btn:active {
		transform: scale(0.98);
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	/* Mobile portrait: larger touch targets */
	@media (max-width: 640px) and (orientation: portrait) {
		.controls {
			gap: 1rem;
		}

		.btn {
			min-height: 56px;
			min-width: 80px;
			flex: 1 1 0;
			font-size: 1.0625rem;
		}
	}

	/* Mobile landscape: full-width, easy thumb reach at bottom */
	@media (orientation: landscape) and (max-height: 500px) {
		.controls {
			flex-direction: row;
			gap: 0.5rem;
		}

		.btn {
			min-height: 52px;
			flex: 1;
			font-size: 0.9375rem;
			padding: 0.625rem 1rem;
		}
	}

	/* Desktop: fixed min-width, no flex grow */
	@media (min-width: 641px) {
		.controls {
			width: auto;
		}

		.btn {
			flex: none;
			min-width: 48px;
		}
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover {
		opacity: 0.95;
	}

	.btn-secondary {
		background: var(--color-secondary);
		color: white;
	}

	.btn-secondary:hover {
		opacity: 0.95;
	}

	.btn-outline {
		background: var(--color-bg-input);
		color: var(--color-text);
		border: 2px solid var(--color-border);
	}

	.btn-outline:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-text-muted);
	}
</style>
