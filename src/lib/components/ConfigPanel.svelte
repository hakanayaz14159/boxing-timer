<script lang="ts">
	import { BOXING_PRESETS } from '$lib/constants/presets';
	import { configStore, LIMITS, STEP_SECONDS } from '$lib/stores/config.svelte';
	import { t } from '$lib/i18n/locale.svelte';
	import { playBell } from '$lib/services/sound';
	import { formatDuration, formatTotal, totalWorkoutSeconds } from '$lib/utils/format';
	import StepperField from './StepperField.svelte';
	import type { PresetId } from '$lib/types/timer';

	const EXERCISE_CHIPS = [60, 90, 120, 180];
	const REST_CHIPS = [30, 45, 60, 90];
	const ROUND_CHIPS = [3, 6, 8, 12];

	let config = $derived(configStore.value);

	let activePresetId = $derived.by((): PresetId | null => {
		const match = BOXING_PRESETS.find(
			(preset) =>
				preset.config.exerciseSeconds === config.exerciseSeconds &&
				preset.config.restSeconds === config.restSeconds &&
				preset.config.rounds === config.rounds
		);
		return match?.id ?? null;
	});

	let totalSeconds = $derived(totalWorkoutSeconds(config));
</script>

<div class="config">
	<section class="section">
		<h2 class="heading">{t('config.quickStart')}</h2>
		<div class="presets">
			{#each BOXING_PRESETS as preset (preset.id)}
				<button
					type="button"
					class="btn preset"
					class:preset--active={preset.id === activePresetId}
					aria-pressed={preset.id === activePresetId}
					onclick={() => configStore.set(preset.config)}
				>
					<span class="preset-name">{t(`presets.${preset.id}`)}</span>
					<span class="preset-detail">
						{t('config.presetDetail', {
							exercise: formatDuration(preset.config.exerciseSeconds),
							rest: formatDuration(preset.config.restSeconds),
							rounds: preset.config.rounds
						})}
					</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="heading">{t('config.custom')}</h2>
		<div class="fields">
			<StepperField
				label={t('config.exercise')}
				value={config.exerciseSeconds}
				min={LIMITS.exerciseSeconds.min}
				max={LIMITS.exerciseSeconds.max}
				step={STEP_SECONDS}
				format={formatDuration}
				chips={EXERCISE_CHIPS}
				onchange={(value) => configStore.update({ exerciseSeconds: value })}
			/>
			<StepperField
				label={t('config.rest')}
				value={config.restSeconds}
				min={LIMITS.restSeconds.min}
				max={LIMITS.restSeconds.max}
				step={STEP_SECONDS}
				format={formatDuration}
				chips={REST_CHIPS}
				onchange={(value) => configStore.update({ restSeconds: value })}
			/>
			<StepperField
				label={t('config.rounds')}
				value={config.rounds}
				min={LIMITS.rounds.min}
				max={LIMITS.rounds.max}
				step={1}
				format={String}
				chips={ROUND_CHIPS}
				onchange={(value) => configStore.update({ rounds: value })}
			/>
		</div>
	</section>

	<div class="summary">
		<span class="total">{t('config.totalTime', { duration: formatTotal(totalSeconds) })}</span>
		<button
			type="button"
			class="btn preview"
			onclick={() => void playBell('round')}
			title={t('config.previewBellTitle')}
		>
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
				<path
					d="M12 2a1 1 0 0 1 1 1v.6a6 6 0 0 1 5 5.9v4l1.7 2.1a1 1 0 0 1-.8 1.6H5.1a1 1 0 0 1-.8-1.6L6 13.5v-4a6 6 0 0 1 5-5.9V3a1 1 0 0 1 1-1Zm0 19a2.5 2.5 0 0 1-2.4-2h4.8A2.5 2.5 0 0 1 12 21Z"
				/>
			</svg>
			{t('config.previewBell')}
		</button>
	</div>
</div>

<style>
	/* An opaque card: the branding watermark passes behind the page, and form
	   labels must stay legible regardless of what is underneath them. */
	.config {
		display: grid;
		gap: var(--sp-6);
		align-content: start;
		width: min(100%, 42rem);
		max-height: 100%;
		padding: var(--sp-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	@media (max-height: 500px) {
		.config {
			gap: var(--sp-3);
			padding: var(--sp-3);
		}
	}

	.section {
		display: grid;
		gap: var(--sp-3);
		min-width: 0;
	}

	.heading {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
		gap: var(--sp-2);
	}

	.preset {
		flex-direction: column;
		gap: var(--sp-1);
		min-height: 60px;
		padding: var(--sp-2);
		text-align: center;
	}

	.preset-name {
		font-size: var(--text-sm);
		font-weight: 600;
	}

	/* No nowrap or ellipsis: the timings must stay readable, so the cell grows. */
	.preset-detail {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
	}

	.preset--active {
		color: var(--color-on-accent);
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.preset--active:hover {
		background: var(--color-accent);
	}

	.preset--active .preset-detail {
		color: inherit;
		opacity: 0.85;
	}

	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: var(--sp-4);
	}

	.summary {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1px solid var(--color-border);
	}

	.total {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
	}

	.preview {
		min-height: var(--tap);
		font-size: var(--text-xs);
		border-radius: var(--radius-pill);
	}
</style>
