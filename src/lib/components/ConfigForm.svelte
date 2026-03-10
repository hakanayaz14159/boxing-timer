<script lang="ts">
	import { configStore } from '$lib/stores/config.svelte';
	import { timerStore } from '$lib/stores/timer.svelte';
	import { formatSeconds } from '$lib/utils/format';
	import { LIMITS, STEP_SECONDS } from '$lib/stores/config.svelte';
	import { BOXING_PRESETS } from '$lib/constants/presets';
	import { playAlarm } from '$lib/services/sound';

	const isDisabled = $derived(timerStore.phase === 'exercise' || timerStore.phase === 'rest');

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

<div class="config-wrapper">
	<section class="presets" aria-label="Quick start presets">
		<h2 class="presets-title">Quick start</h2>
		<div class="presets-grid">
			{#each BOXING_PRESETS as preset (preset.id)}
				<button
					type="button"
					class="preset-btn"
					disabled={isDisabled}
					onclick={() => timerStore.start(preset.config)}
					title="Start {preset.label}"
				>
					{preset.label}
				</button>
			{/each}
		</div>
	</section>

	<form class="config-form" onsubmit={(e) => e.preventDefault()}>
		<h2 class="config-title">Custom</h2>
		<div class="field">
			<div class="field-header">
				<label for="exercise">Exercise</label>
				<span class="value" aria-live="polite">{formatSeconds(exerciseSeconds)}</span>
			</div>
			<input
				id="exercise"
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
				<label for="rest">Rest</label>
				<span class="value" aria-live="polite">{formatSeconds(restSeconds)}</span>
			</div>
			<input
				id="rest"
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
			<label for="rounds">Rounds</label>
			<div class="stepper">
				<button
					type="button"
					class="stepper-btn"
					disabled={isDisabled || rounds <= LIMITS.rounds.min}
					onclick={() => setRounds(-1)}
					aria-label="Decrease rounds"
				>
					−
				</button>
				<span class="stepper-value" aria-live="polite">{rounds}</span>
				<button
					type="button"
					class="stepper-btn"
					disabled={isDisabled || rounds >= LIMITS.rounds.max}
					onclick={() => setRounds(1)}
					aria-label="Increase rounds"
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
				title="Preview round-end bell"
			>
				Preview bell
			</button>
		</div>
	</form>
</div>

<style>
	.config-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 20rem;
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.config-wrapper {
			gap: 1rem;
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
	}

	.preset-btn {
		min-height: 44px;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
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
