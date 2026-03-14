<script lang="ts">
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { registerSW } from 'virtual:pwa-register';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { locale } from '$lib/i18n';
	import { setWakeLock, ensureVisibilityHandler } from '$lib/services/wakeLock';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		const phase = timerStore.phase;
		const shouldHold = phase === 'countdown' || phase === 'exercise' || phase === 'rest';
		ensureVisibilityHandler();
		setWakeLock(shouldHold);
	});

	$effect(() => {
		const pref = themeStore.preference;
		const effective = themeStore.effectiveTheme;
		const doc = typeof document !== 'undefined' ? document.documentElement : null;
		if (doc) {
			if (pref === 'system') {
				doc.removeAttribute('data-theme');
			} else {
				doc.setAttribute('data-theme', effective);
			}
		}
	});

	$effect(() => {
		const lang = $locale;
		const doc = typeof document !== 'undefined' ? document.documentElement : null;
		if (doc) doc.setAttribute('lang', lang);
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
	{#if themeStore.preference === 'system'}
		<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
		<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
	{:else}
		<meta name="theme-color" content={themeStore.themeColor} />
	{/if}
	{#if pwaInfo?.webManifest?.linkTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- PWA manifest link from trusted build-time plugin -->
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>

{@render children()}
