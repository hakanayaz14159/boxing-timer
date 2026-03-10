<script lang="ts">
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { registerSW } from 'virtual:pwa-register';
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

	onMount(() => {
		if (pwaInfo) {
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-180.png`} />
	{#if pwaInfo?.webManifest?.linkTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- PWA manifest link from trusted build-time plugin -->
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>

{@render children()}
