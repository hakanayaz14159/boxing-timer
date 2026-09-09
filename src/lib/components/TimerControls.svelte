<script lang="ts">
	import { timerStore } from '$lib/stores/timer.svelte';
	import { t } from '$lib/i18n/locale.svelte';

	const CONFIRM_WINDOW_MS = 3000;

	let phase = $derived(timerStore.phase);
	let isRunning = $derived(phase === 'countdown' || phase === 'exercise' || phase === 'rest');
	let canPause = $derived(phase === 'exercise' || phase === 'rest');

	let confirming = $state(false);
	let confirmTimeout: ReturnType<typeof setTimeout> | null = null;

	function cancelConfirm() {
		if (confirmTimeout !== null) {
			clearTimeout(confirmTimeout);
			confirmTimeout = null;
		}
		confirming = false;
	}

	function handleReset() {
		if (!isRunning || confirming) {
			cancelConfirm();
			timerStore.reset();
			return;
		}
		confirming = true;
		confirmTimeout = setTimeout(cancelConfirm, CONFIRM_WINDOW_MS);
	}

	$effect(() => {
		if (!isRunning) cancelConfirm();
		return cancelConfirm;
	});
</script>

<div class="controls">
	{#if phase === 'config' || phase === 'finished'}
		<button
			type="button"
			class="btn btn--accent btn--workout start"
			onclick={() => timerStore.start()}
		>
			{t('controls.start')}
		</button>
	{/if}

	{#if canPause}
		<button
			type="button"
			class="btn btn--inverse btn--workout control"
			onclick={() => timerStore.togglePause()}
		>
			{timerStore.isPaused ? t('controls.resume') : t('controls.pause')}
		</button>
	{/if}

	{#if isRunning || phase === 'finished'}
		<button
			type="button"
			class="btn btn--workout control reset"
			class:reset--confirming={confirming}
			onclick={handleReset}
			title={confirming ? t('controls.confirmResetHint') : undefined}
		>
			{confirming ? t('controls.confirmReset') : t('controls.reset')}
		</button>
	{/if}
</div>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--sp-4);
		width: min(100%, 42rem);
		margin-inline: auto;
	}

	.start {
		--control-h: 64px;
		flex: 1 1 100%;
		font-size: var(--text-xl);
	}

	.control {
		flex: 1 1 10rem;
	}

	/*
	 * Outlined in the text colour: secondary to the filled Pause, yet visible on
	 * every phase background, where the default grey border washes out. The
	 * confirming state is unmistakable rather than a silent one-tap discard.
	 */
	.reset {
		flex: 0 1 9rem;
		color: var(--color-text);
		background: transparent;
		border-color: currentColor;
	}

	.reset--confirming {
		color: var(--color-on-accent);
		background: var(--color-accent);
		border-color: var(--color-accent);
	}
</style>
