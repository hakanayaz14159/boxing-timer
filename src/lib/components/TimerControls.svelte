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
		align-items: center;
	}

	.btn {
		min-height: 48px;
		min-width: 48px;
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
