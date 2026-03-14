<script lang="ts">
	import { configStore } from '$lib/stores/config.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { formatSeconds } from '$lib/utils/format';
	import { LIMITS, STEP_SECONDS } from '$lib/stores/config.svelte';
	import { BOXING_PRESETS } from '$lib/constants/presets';
	import { playAlarm } from '$lib/services/sound';
	import { localeStore, locale } from '$lib/i18n';
	import { onMount } from 'svelte';

	const t = localeStore.t.bind(localeStore);
	$locale;

	const isDisabled = $derived(timerStore.phase === 'exercise' || timerStore.phase === 'rest');

	let activeTab = $state<'presets' | 'custom'>('presets');
	let useTabs = $state(false);
	let tabPanelsEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		void activeTab;
		tabPanelsEl?.scrollTo({ top: 0 });
	});

	onMount(() => {
		const mq = window.matchMedia(
			'(max-width: 640px), ((orientation: landscape) and (max-height: 500px))'
		);
		useTabs = mq.matches;
		const handler = () => {
			useTabs = mq.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	const exerciseSeconds = $derived(configStore.value.exerciseSeconds);
	const restSeconds = $derived(configStore.value.restSeconds);
	const rounds = $derived(configStore.value.rounds);

	function setExercise(v: number) {
		configStore.update({
			exerciseSeconds: Math.round(v / STEP_SECONDS) * STEP_SECONDS
		});
	}

	function setRest(v: number) {
		configStore.update({
			restSeconds: Math.round(v / STEP_SECONDS) * STEP_SECONDS
		});
	}

	function setRounds(delta: number) {
		configStore.update({
			rounds: Math.max(LIMITS.rounds.min, Math.min(LIMITS.rounds.max, rounds + delta))
		});
	}
</script>

{#snippet configFields(idSuffix: '' | '-landscape')}
	<div class="field">
		<div class="field-header">
			<label for="exercise{idSuffix}">{t('config.exercise')}</label>
			<span class="value" aria-live="polite">{formatSeconds(exerciseSeconds)}</span>
		</div>
		<input
			id="exercise{idSuffix}"
			type="range"
			min={LIMITS.exerciseSeconds.min}
			max={LIMITS.exerciseSeconds.max}
			step={STEP_SECONDS}
			value={exerciseSeconds}
			disabled={isDisabled}
			oninput={(e) => setExercise(+(e.currentTarget as HTMLInputElement).value)}
		/>
		<div class="range-labels">
			<span>{formatSeconds(LIMITS.exerciseSeconds.min)}</span>
			<span>{formatSeconds(LIMITS.exerciseSeconds.max)}</span>
		</div>
	</div>
	<div class="field">
		<div class="field-header">
			<label for="rest{idSuffix}">{t('config.rest')}</label>
			<span class="value" aria-live="polite">{formatSeconds(restSeconds)}</span>
		</div>
		<input
			id="rest{idSuffix}"
			type="range"
			min={LIMITS.restSeconds.min}
			max={LIMITS.restSeconds.max}
			step={STEP_SECONDS}
			value={restSeconds}
			disabled={isDisabled}
			oninput={(e) => setRest(+(e.currentTarget as HTMLInputElement).value)}
		/>
		<div class="range-labels">
			<span>{formatSeconds(LIMITS.restSeconds.min)}</span>
			<span>{formatSeconds(LIMITS.restSeconds.max)}</span>
		</div>
	</div>
	<div class="field">
		<label for="rounds{idSuffix}">{t('config.rounds')}</label>
		<div class="stepper">
			<button
				type="button"
				class="stepper-btn"
				disabled={isDisabled || rounds <= LIMITS.rounds.min}
				onclick={() => setRounds(-1)}
				aria-label={t('config.decreaseRounds')}
			>
				−
			</button>
			<span class="stepper-value" aria-live="polite">{rounds}</span>
			<button
				type="button"
				class="stepper-btn"
				disabled={isDisabled || rounds >= LIMITS.rounds.max}
				onclick={() => setRounds(1)}
				aria-label={t('config.increaseRounds')}
			>
				+
			</button>
		</div>
	</div>
	<div class="field">
		<button
			type="button"
			class="preview-btn"
			disabled={isDisabled}
			onclick={() => playAlarm('round_end')}
			title={t('config.previewBellTitle')}
		>
			{t('config.previewBell')}
		</button>
	</div>
{/snippet}

<div class="config-wrapper" class:tabbed={useTabs} class:desktop={!useTabs}>
	{#if useTabs}
		<div class="tabs" role="tablist" aria-label={t('config.configSections')}>
			<button
				type="button"
				role="tab"
				aria-selected={activeTab === 'presets'}
				aria-controls="tab-presets"
				id="tab-btn-presets"
				class="tab-btn"
				class:active={activeTab === 'presets'}
				onclick={() => (activeTab = 'presets')}
			>
				{t('config.quickStart')}
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={activeTab === 'custom'}
				aria-controls="tab-custom"
				id="tab-btn-custom"
				class="tab-btn"
				class:active={activeTab === 'custom'}
				onclick={() => (activeTab = 'custom')}
			>
				{t('config.custom')}
			</button>
		</div>
		<div class="tab-panels" bind:this={tabPanelsEl}>
			<div
				id="tab-presets"
				role="tabpanel"
				aria-labelledby="tab-btn-presets"
				class="tab-panel"
				hidden={activeTab !== 'presets'}
			>
				<div class="presets-grid">
					{#each BOXING_PRESETS as preset (preset.id)}
						<button
							type="button"
							class="preset-btn"
							disabled={isDisabled}
							onclick={() => timerStore.start(preset.config)}
							title={`${t('controls.start')} ${t(`presets.${preset.id}`)}`}
						>
							{t(`presets.${preset.id}`)}
						</button>
					{/each}
				</div>
			</div>
			<div
				id="tab-custom"
				role="tabpanel"
				aria-labelledby="tab-btn-custom"
				class="tab-panel"
				hidden={activeTab !== 'custom'}
			>
				<form class="config-form" onsubmit={(e) => e.preventDefault()}>
					{@render configFields('-landscape')}
				</form>
			</div>
		</div>
	{:else}
		<div class="desktop-side-by-side">
			<section class="presets" aria-label={t('config.quickStart')}>
				<h2 class="presets-title">{t('config.quickStart')}</h2>
				<div class="presets-grid">
					{#each BOXING_PRESETS as preset (preset.id)}
						<button
							type="button"
							class="preset-btn"
							disabled={isDisabled}
							onclick={() => timerStore.start(preset.config)}
							title={`${t('controls.start')} ${t(`presets.${preset.id}`)}`}
						>
							{t(`presets.${preset.id}`)}
						</button>
					{/each}
				</div>
			</section>

			<form class="config-form" onsubmit={(e) => e.preventDefault()}>
				<h2 class="config-title">{t('config.custom')}</h2>
				{@render configFields('')}
			</form>
		</div>
	{/if}
</div>

<style>
	.config-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 20rem;
	}

	.config-wrapper.tabbed {
		max-width: none;
		flex: 1;
		min-width: 0;
		min-height: 0;
		gap: 0;
		width: 100%;
	}

	.config-wrapper.desktop {
		max-width: 42rem;
	}

	.desktop-side-by-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		width: 100%;
		min-width: 0;
	}

	.tabs {
		display: flex;
		flex-shrink: 0;
		min-width: 0;
		gap: 0;
		border-bottom: 1px solid var(--color-border);
	}

	.tab-btn {
		flex: 1;
		min-height: 44px;
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	.tab-btn.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	.tab-btn:hover:not(.active) {
		color: var(--color-text);
	}

	.tab-panels {
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow-y: auto;
		padding: 1rem 12px 1rem;
	}

	.tab-panel {
		min-width: 0;
	}

	.config-wrapper.tabbed .config-form {
		gap: 1.5rem;
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.config-wrapper.tabbed .tabs .tab-btn {
			min-height: 36px;
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
		}

		.config-wrapper.tabbed .tab-panels {
			padding: 0.25rem 8px 0;
			overflow: hidden;
		}

		.config-wrapper.tabbed .presets-grid {
			gap: 0.375rem;
		}

		.config-wrapper.tabbed .presets-grid .preset-btn {
			min-height: 40px;
			padding: 0.375rem 0.5rem;
			font-size: 0.8125rem;
		}

		.config-wrapper.tabbed .config-form {
			gap: 0.375rem;
		}

		.config-wrapper.tabbed .field {
			gap: 0.125rem;
		}

		.config-wrapper.tabbed .field label,
		.config-wrapper.tabbed .value {
			font-size: 0.75rem;
		}

		.config-wrapper.tabbed .range-labels {
			font-size: 0.625rem;
		}

		.config-wrapper.tabbed input[type='range'] {
			height: 5px;
		}

		.config-wrapper.tabbed input[type='range']::-webkit-slider-thumb {
			width: 14px;
			height: 14px;
		}

		.config-wrapper.tabbed input[type='range']::-moz-range-thumb {
			width: 14px;
			height: 14px;
		}

		.config-wrapper.tabbed .stepper {
			padding: 0.125rem;
		}

		.config-wrapper.tabbed .stepper-btn {
			flex: 0 0 28px;
			height: 28px;
			font-size: 1.125rem;
		}

		.config-wrapper.tabbed .stepper-value {
			font-size: 0.875rem;
		}

		.config-wrapper.tabbed .preview-btn {
			min-height: 24px;
			padding: 0.2rem 0.4rem;
			font-size: 0.6875rem;
		}
	}

	.presets-title,
	.config-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin: 0 0 0.75rem;
	}

	.presets-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		min-width: 0;
	}

	.preset-btn {
		min-width: 0;
		min-height: 44px;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		background: var(--color-bg-input);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.preset-btn:hover:not(:disabled) {
		background: var(--color-bg-hover);
		border-color: var(--color-text-muted);
	}

	.preset-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.config-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		min-width: 0;
	}

	.field label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.value {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		min-width: 0;
		height: 8px;
		border-radius: 4px;
		background: var(--color-border);
		outline: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
		transition: transform 0.15s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	input[type='range']::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
		border: none;
	}

	input[type='range']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	input[type='range']:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	input[type='range']:disabled::-moz-range-thumb {
		cursor: not-allowed;
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		background: var(--color-bg-input);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.25rem;
	}

	.stepper-btn {
		flex: 0 0 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 600;
		background: var(--color-bg-hover);
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text);
		cursor: pointer;
		transition: background 0.15s;
	}

	.stepper-btn:hover:not(:disabled) {
		background: var(--color-border);
	}

	.stepper-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.stepper-value {
		flex: 1;
		min-width: 0;
		text-align: center;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.preview-btn {
		min-height: 36px;
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		background: var(--color-bg-input);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.preview-btn:hover:not(:disabled) {
		background: var(--color-bg-hover);
		border-color: var(--color-text-muted);
	}

	.preview-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
