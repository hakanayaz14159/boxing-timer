<script lang="ts">
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { registerSW } from 'virtual:pwa-register';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { themeStore, CHROME_COLORS } from '$lib/stores/theme.svelte';
	import { localeStore, t } from '$lib/i18n/locale.svelte';
	import { setWakeLock } from '$lib/services/wakeLock';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		const phase = timerStore.phase;
		const shouldHold = phase === 'countdown' || phase === 'exercise' || phase === 'rest';
		void setWakeLock(shouldHold);
	});

	$effect(() => {
		const preference = themeStore.preference;
		const root = document.documentElement;
		if (preference === 'system') {
			root.removeAttribute('data-theme');
		} else {
			root.setAttribute('data-theme', preference);
		}
	});

	$effect(() => {
		document.documentElement.setAttribute('lang', localeStore.value);
	});

	onMount(() => {
		if (pwaInfo) {
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<title>{t('app.title')}</title>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-180.png`} />
	{#if themeStore.preference === 'system'}
		<meta name="theme-color" content={CHROME_COLORS.light} media="(prefers-color-scheme: light)" />
		<meta name="theme-color" content={CHROME_COLORS.dark} media="(prefers-color-scheme: dark)" />
	{:else}
		<meta name="theme-color" content={themeStore.chromeColor} />
	{/if}
	{#if pwaInfo?.webManifest?.linkTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- PWA manifest link from trusted build-time plugin -->
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>

{@render children()}
