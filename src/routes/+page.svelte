<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import BackgroundBranding from '$lib/components/BackgroundBranding.svelte';
	import ConfigPanel from '$lib/components/ConfigPanel.svelte';
	import CountdownDisplay from '$lib/components/CountdownDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import TimerMeta from '$lib/components/TimerMeta.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';

	let phase = $derived(timerStore.phase);
	let isConfiguring = $derived(phase === 'config');
</script>

<main class="page" data-phase={phase}>
	<!-- Full presence while configuring; dimmed once a round is running. -->
	<BackgroundBranding dimmed={!isConfiguring} />

	<!-- Theme and language controls leave with the config screen; the header row
	     is given to the round counter, which must be legible across a room. -->
	{#if isConfiguring}
		<AppHeader />
		<div class="stage stage--config">
			<ConfigPanel />
		</div>
	{:else}
		<TimerMeta />
		<div class="stage">
			<CountdownDisplay />
		</div>
	{/if}

	<div class="controls">
		<TimerControls />
	</div>
</main>

<style>
	/*
	 * One grid owns every region. The mark is the exception: it is taken out of
	 * the grid so a corner watermark cannot change the rows.
	 */
	.page {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-areas:
			'header'
			'stage'
			'controls';
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: var(--sp-3);
		height: 100svh;
		padding: var(--sp-3) var(--sp-4);
		padding-bottom: calc(var(--sp-3) + env(safe-area-inset-bottom, 0));
		background: var(--color-bg);
		transition: background var(--motion-slow) var(--ease);
		overflow: hidden;
	}

	.page[data-phase='exercise'] {
		background: var(--color-bg-exercise);
	}

	.page[data-phase='rest'] {
		background: var(--color-bg-rest);
	}

	.stage {
		grid-area: stage;
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		min-height: 0;
		min-width: 0;
	}

	.stage--config {
		place-items: center;
	}

	.controls {
		grid-area: controls;
		min-width: 0;
	}

	/* Landscape phones: the header is the least valuable row, so it goes first. */
	@media (max-height: 500px) {
		.page {
			gap: var(--sp-2);
			padding: var(--sp-2) var(--sp-3);
		}
	}
</style>
