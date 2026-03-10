<script lang="ts">
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { setWakeLock, ensureVisibilityHandler } from '$lib/services/wakeLock';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		const phase = timerStore.phase;
		const shouldHold = phase === 'countdown' || phase === 'exercise' || phase === 'rest';
		ensureVisibilityHandler();
		setWakeLock(shouldHold);
	});

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-180.png`} />
	{#if pwaInfo?.webManifest?.linkTag}
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>

{@render children()}
