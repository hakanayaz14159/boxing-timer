<script lang="ts">
	import { GITHUB_REPO_URL } from '$lib/constants';
	import { localeStore, t, type Locale, type TranslationKey } from '$lib/i18n/locale.svelte';
	import { themeStore, type ThemePreference } from '$lib/stores/theme.svelte';

	const THEME_OPTIONS: { value: ThemePreference; labelKey: TranslationKey }[] = [
		{ value: 'light', labelKey: 'app.themeLight' },
		{ value: 'system', labelKey: 'app.themeSystem' },
		{ value: 'dark', labelKey: 'app.themeDark' }
	];

	const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
		{ value: 'en', label: 'EN' },
		{ value: 'tr', label: 'TR' }
	];
</script>

<header class="top-bar">
	<div class="actions">
		<div class="segmented" role="group" aria-label={t('app.theme')}>
			{#each THEME_OPTIONS as option (option.value)}
				<button
					type="button"
					class="seg"
					class:seg--active={themeStore.preference === option.value}
					aria-pressed={themeStore.preference === option.value}
					aria-label={t(option.labelKey)}
					title={t(option.labelKey)}
					onclick={() => (themeStore.preference = option.value)}
				>
					{#if option.value === 'light'}
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
							><circle cx="12" cy="12" r="5" /><path
								d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
							/></svg
						>
					{:else if option.value === 'system'}
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
							><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg
						>
					{:else}
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
						>
					{/if}
				</button>
			{/each}
		</div>

		<div class="segmented" role="group" aria-label={t('app.language')}>
			{#each LOCALE_OPTIONS as option (option.value)}
				<button
					type="button"
					class="seg seg--text"
					class:seg--active={localeStore.value === option.value}
					aria-pressed={localeStore.value === option.value}
					onclick={() => localeStore.set(option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>

		<a
			href={GITHUB_REPO_URL}
			target="_blank"
			rel="external noopener noreferrer"
			class="github"
			aria-label={t('app.viewOnGitHub')}
		>
			<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
	</div>
</header>

<style>
	.top-bar {
		grid-area: header;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		min-width: 0;
		padding-top: env(safe-area-inset-top, 0);
	}

	/* A landscape phone is the wall-mount case: give every pixel to the countdown. */
	@media (max-height: 500px) {
		.top-bar {
			display: none;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
	}

	.segmented {
		display: flex;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.seg {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: var(--tap);
		min-height: var(--tap);
		padding: 0 var(--sp-2);
		font-family: inherit;
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 0;
		cursor: pointer;
		transition:
			background var(--motion-fast) var(--ease),
			color var(--motion-fast) var(--ease);
	}

	.seg--text {
		min-width: 0;
		padding: 0 var(--sp-3);
	}

	.seg:not(:last-child) {
		border-right: 1px solid var(--color-border-strong);
	}

	.seg:hover {
		background: var(--color-surface-2);
		color: var(--color-text);
	}

	.seg--active {
		color: var(--color-on-accent);
		background: var(--color-accent);
	}

	.seg:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: -3px;
	}

	.github {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--tap);
		height: var(--tap);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		transition: color var(--motion-fast) var(--ease);
	}

	.github:hover {
		color: var(--color-text);
	}

	.github:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
