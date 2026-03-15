<script lang="ts">
	import { GITHUB_REPO_URL } from '$lib/constants';
	import { localeStore, locale } from '$lib/i18n';
	import { themeStore } from '$lib/stores/theme.svelte';
	import type { Locale } from '$lib/i18n';
	import type { ThemePreference } from '$lib/stores/theme.svelte';

	const t = localeStore.t.bind(localeStore);
	$locale;
	$themeStore;

	function setTheme(p: ThemePreference) {
		themeStore.preference = p;
	}

	function setLocale(l: Locale) {
		localeStore.locale = l;
	}
</script>

<div class="top-bar">
	<span class="title">{t('app.title')}</span>
	<div class="header-actions">
		<div class="theme-toggle" role="group" aria-label="Theme">
			<button
				type="button"
				class="theme-btn"
				class:active={$themeStore === 'light'}
				onclick={() => setTheme('light')}
				aria-pressed={$themeStore === 'light'}
				title="Light theme"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
			</button>
			<button
				type="button"
				class="theme-btn"
				class:active={$themeStore === 'system'}
				onclick={() => setTheme('system')}
				aria-pressed={$themeStore === 'system'}
				title="System theme"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
			</button>
			<button
				type="button"
				class="theme-btn"
				class:active={$themeStore === 'dark'}
				onclick={() => setTheme('dark')}
				aria-pressed={$themeStore === 'dark'}
				title="Dark theme"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
			</button>
		</div>
		<div class="lang-toggle" role="group" aria-label="Language">
			<button
				type="button"
				class="lang-btn"
				class:active={$locale === 'en'}
				onclick={() => setLocale('en')}
				aria-pressed={$locale === 'en'}
			>
				EN
			</button>
			<button
				type="button"
				class="lang-btn"
				class:active={$locale === 'tr'}
				onclick={() => setLocale('tr')}
				aria-pressed={$locale === 'tr'}
			>
				TR
			</button>
		</div>
		<a
			href={GITHUB_REPO_URL}
			target="_blank"
			rel="external noopener noreferrer"
			class="github-link"
			aria-label={t('app.viewOnGitHub')}
		>
			<svg
				class="github-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
	</div>
</div>

<style>
	.top-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		padding-top: calc(1rem + env(safe-area-inset-top, 0));
		z-index: 10;
		pointer-events: none;
	}

	.top-bar > * {
		pointer-events: auto;
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.top-bar {
			display: none;
		}
	}

	.title {
		font-size: clamp(1.25rem, 4vw, 1.5rem);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		letter-spacing: -0.02em;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.theme-toggle,
	.lang-toggle {
		display: flex;
		align-items: center;
		gap: 0;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.theme-btn,
	.lang-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		padding: 0 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		background: var(--color-bg-input);
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}

	.theme-btn:not(:last-child),
	.lang-btn:not(:last-child) {
		border-right: 1px solid var(--color-border);
	}

	.theme-btn:hover,
	.lang-btn:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}

	.theme-btn.active,
	.lang-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.theme-btn:focus-visible,
	.lang-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}

	.github-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text-muted);
		transition:
			color 0.15s,
			transform 0.15s;
	}

	.github-link:hover {
		color: var(--color-text);
		transform: scale(1.05);
	}

	.github-link:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
		border-radius: var(--radius-md);
	}

	.github-icon {
		width: 24px;
		height: 24px;
	}
</style>
