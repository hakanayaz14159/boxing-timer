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
</script>

<AppHeader />
<main class="page">
	{#if showConfig}
		<div class="config-section">
			<ConfigForm />
		</div>
	{/if}
	{#if showCountdown}
		<CountdownDisplay />
	{/if}
	<div class="controls-wrapper">
		<TimerControls />
	</div>
</main>

<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		padding: 6rem 1.5rem 2rem;
		padding-bottom: calc(2rem + env(safe-area-inset-bottom, 0));
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.page {
			padding-top: 4rem;
			padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
		}

		.controls-wrapper {
			margin-top: 1rem;
			padding-top: 1rem;
			max-width: none;
		}
	}

	.config-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		flex: 1;
		min-height: 0;
		justify-content: center;
		overflow-y: auto;
	}

	.controls-wrapper {
		width: 100%;
		max-width: 20rem;
		flex-shrink: 0;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}
</style>
