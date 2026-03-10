<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import ConfigForm from '$lib/components/ConfigForm.svelte';
	import CountdownDisplay from '$lib/components/CountdownDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';

	const phase = $derived(timerStore.phase);
	const showConfig = $derived(phase === 'config' || phase === 'ready');
	const showCountdown = $derived(
		phase === 'countdown' || phase === 'exercise' || phase === 'rest' || phase === 'finished'
	);

	const phaseLabel = $derived.by(() => {
		if (phase === 'exercise') return 'Exercise';
		if (phase === 'rest') return 'Rest';
		if (phase === 'countdown') return 'Get Ready';
		if (phase === 'finished') return 'Workout Complete';
		return '';
	});

	const showRound = $derived(phase === 'exercise' || phase === 'rest');
</script>

<div class="page-wrapper">
	<AppHeader />
	<main
		class="page"
		class:phase-exercise={phase === 'exercise'}
		class:phase-rest={phase === 'rest'}
		class:countdown-layout={showCountdown}
		class:config-layout={showConfig}
	>
	{#if showConfig}
		<div class="config-split">
			<div class="config-left">
				<ConfigForm />
			</div>
			<div class="config-right">
				<TimerControls />
			</div>
		</div>
	{/if}
	{#if showCountdown}
		<div class="countdown-split">
			<div class="countdown-left">
				<CountdownDisplay />
			</div>
			<div class="countdown-right">
				<div class="right-info">
					{#if phaseLabel}
						<span class="phase-label">{phaseLabel}</span>
					{/if}
					{#if showRound}
						<span class="round">Round {timerStore.currentRound} / {timerStore.activeConfig.rounds}</span>
					{/if}
				</div>
				<div class="controls-divider"></div>
				<TimerControls />
			</div>
		</div>
	{/if}
</main>
</div>

<style>
	.page-wrapper {
		position: relative;
		height: 100dvh;
	}

	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		overflow: hidden;
		background: var(--color-bg);
		padding: calc(1.5rem + env(safe-area-inset-top, 0)) 1.5rem calc(2rem + env(safe-area-inset-bottom, 0));
		transition: background 0.3s ease;
	}

	.page.countdown-layout,
	.page.config-layout {
		padding: calc(1.5rem + env(safe-area-inset-top, 0)) 1rem calc(1rem + env(safe-area-inset-bottom, 0));
		justify-content: stretch;
	}

	.countdown-split {
		display: flex;
		flex: 1;
		width: 100%;
		min-height: 0;
		gap: 1rem;
	}

	.countdown-left {
		flex: 0 0 70%;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.countdown-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-width: 0;
	}

	.countdown-right .phase-label {
		font-size: clamp(0.875rem, 2.5vw, 1.25rem);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.countdown-right .round {
		font-size: clamp(1.25rem, 4vw, 2rem);
		font-weight: 700;
		font-family: var(--font-display, system-ui, sans-serif);
		color: var(--color-text);
	}

	.right-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.controls-divider {
		width: 100%;
		max-width: 12rem;
		height: 0;
		border-top: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.countdown-right :global(.controls),
	.config-right :global(.controls) {
		flex-direction: column;
		width: 100%;
		max-width: 12rem;
	}

	.countdown-right :global(.btn-primary),
	.config-right :global(.btn-primary) {
		min-height: 56px;
		font-size: 1.25rem;
		padding: 0.875rem 1.5rem;
	}

	.page.phase-exercise {
		background: var(--color-bg-exercise);
	}

	.page.phase-rest {
		background: var(--color-bg-rest);
	}

	@media (max-width: 640px) and (orientation: portrait) {
		.page {
			padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0));
		}

		.page.countdown-layout,
		.page.config-layout {
			padding: calc(1.5rem + env(safe-area-inset-top, 0)) 0.75rem calc(1rem + env(safe-area-inset-bottom, 0));
		}

		.countdown-split,
		.config-split {
			flex-direction: column;
			gap: 0.75rem;
		}

		.countdown-left,
		.config-left {
			flex: 1;
			min-height: 0;
		}

		.countdown-right,
		.config-right {
			flex-shrink: 0;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.75rem;
		}

		.countdown-right .right-info {
			width: 100%;
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
		}

		.countdown-right .controls-divider {
			width: 100%;
			max-width: none;
		}

		.countdown-right :global(.controls) {
			max-width: none;
			flex-direction: row;
			justify-content: center;
		}

		.config-right :global(.controls) {
			max-width: none;
			flex-direction: row;
			justify-content: center;
		}

		.countdown-right :global(.btn-primary),
		.config-right :global(.btn-primary) {
			min-height: 64px;
			font-size: 1.375rem;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.page {
			padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0));
		}

		.page.countdown-layout,
		.page.config-layout {
			padding: calc(0.5rem + env(safe-area-inset-top, 0)) 0.75rem calc(0.5rem + env(safe-area-inset-bottom, 0));
		}

		.countdown-split,
		.config-split {
			flex-direction: row;
			gap: 0.5rem;
		}

		.countdown-left,
		.config-left {
			flex: 0 0 70%;
			min-height: 0;
		}

		.countdown-right,
		.config-right {
			flex: 1;
			flex-direction: column;
			justify-content: center;
		}

		.countdown-right :global(.controls) {
			max-width: none;
			flex-direction: column;
		}

		.config-right :global(.controls) {
			max-width: none;
			flex-direction: column;
		}
	}

	.config-split {
		display: flex;
		flex: 1;
		width: 100%;
		min-height: 0;
		gap: 1rem;
	}

	.config-left {
		flex: 0 0 70%;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: auto;
	}

	.config-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-width: 0;
	}

</style>
