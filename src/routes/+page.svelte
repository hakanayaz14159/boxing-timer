<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BackgroundBranding from '$lib/components/BackgroundBranding.svelte';
	import ConfigForm from '$lib/components/ConfigForm.svelte';
	import CountdownDisplay from '$lib/components/CountdownDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import TimerOverlay from '$lib/components/TimerOverlay.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';

	const phase = $derived(timerStore.phase);
	const showConfig = $derived(phase === 'config');
	const showCountdown = $derived(
		phase === 'countdown' || phase === 'exercise' || phase === 'rest' || phase === 'finished'
	);
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
		<BackgroundBranding />
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
			<div class="timer-center">
				<CountdownDisplay />
				<TimerOverlay />
			</div>
		{/if}
	</main>
</div>

<style>
	.page-wrapper {
		position: relative;
		height: 100dvh;
		overflow: hidden;
	}

	.page {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		overflow: visible;
		background: var(--color-bg);
		padding: calc(1.5rem + env(safe-area-inset-top, 0)) 1.5rem
			calc(2rem + env(safe-area-inset-bottom, 0));
		transition: background 0.3s ease;
	}

	.page.countdown-layout {
		padding: 0;
		justify-content: center;
	}

	.page.config-layout {
		padding: calc(1.5rem + env(safe-area-inset-top, 0)) 1rem
			calc(1rem + env(safe-area-inset-bottom, 0));
		justify-content: stretch;
	}

	.timer-center {
		position: relative;
		z-index: 1;
		flex: 1;
		width: 100%;
		min-width: 0;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.config-split {
		position: relative;
		z-index: 1;
		display: flex;
		flex: 1;
		width: 100%;
		min-width: 0;
		min-height: 0;
		align-self: stretch;
	}

	.config-right :global(.controls) {
		flex-direction: row;
		width: 100%;
		max-width: 24rem;
		gap: 0.875rem;
	}

	.config-right :global(.btn) {
		min-height: 64px;
		font-size: 1.25rem;
		padding: 1rem 1.5rem;
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

		.page.config-layout {
			padding: calc(1.5rem + env(safe-area-inset-top, 0)) 0.75rem
				calc(1rem + env(safe-area-inset-bottom, 0));
		}

		.config-split {
			flex-direction: column;
			gap: 0.75rem;
		}

		.config-left {
			flex: 1;
			min-height: 0;
			overflow: hidden;
			align-items: stretch;
			justify-content: flex-start;
		}

		.config-right {
			flex-shrink: 0;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.75rem;
		}

		.config-right :global(.controls) {
			max-width: none;
			flex-direction: row;
			justify-content: center;
			gap: 1rem;
		}

		.config-right :global(.btn) {
			min-height: 72px;
			font-size: 1.375rem;
			padding: 1rem 1.5rem;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.page {
			padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0));
		}

		.page.config-layout {
			padding: calc(0.5rem + env(safe-area-inset-top, 0)) 1rem
				calc(0.25rem + env(safe-area-inset-bottom, 0));
		}

		.config-split {
			flex-direction: column;
			gap: 0.125rem;
		}

		.config-left {
			flex: 1;
			min-width: 0;
			min-height: 0;
			overflow: hidden;
			align-items: stretch;
			justify-content: flex-start;
		}

		.config-right {
			flex-shrink: 0;
			width: 100%;
			flex-direction: row;
			justify-content: stretch;
		}

		.config-right :global(.controls) {
			width: 100%;
			max-width: none;
			flex-direction: row;
			justify-content: center;
			gap: 0.75rem;
		}

		.config-right :global(.btn) {
			flex: 1;
			min-height: 56px;
			font-size: 1.125rem;
			padding: 0.75rem 1.25rem;
		}
	}

	.config-split {
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
