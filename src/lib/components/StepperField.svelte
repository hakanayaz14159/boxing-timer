<script lang="ts">
	import { t } from '$lib/i18n/locale.svelte';

	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		step: number;
		format: (value: number) => string;
		/** Common values offered as one-tap shortcuts. */
		chips?: number[];
		onchange: (value: number) => void;
	}

	let { label, value, min, max, step, format, chips = [], onchange }: Props = $props();

	let canDecrease = $derived(value > min);
	let canIncrease = $derived(value < max);

	function nudge(delta: number) {
		onchange(Math.min(max, Math.max(min, value + delta)));
	}
</script>

<fieldset class="field">
	<legend class="label">{label}</legend>

	<div class="row">
		<button
			type="button"
			class="btn step"
			onclick={() => nudge(-step)}
			disabled={!canDecrease}
			aria-label={t('config.decrease', { label })}
		>
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
				<rect x="5" y="11" width="14" height="2" rx="1" />
			</svg>
		</button>

		<output class="value">{format(value)}</output>

		<button
			type="button"
			class="btn step"
			onclick={() => nudge(step)}
			disabled={!canIncrease}
			aria-label={t('config.increase', { label })}
		>
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
				<rect x="5" y="11" width="14" height="2" rx="1" />
				<rect x="11" y="5" width="2" height="14" rx="1" />
			</svg>
		</button>
	</div>

	{#if chips.length > 0}
		<div class="chips">
			{#each chips as chip (chip)}
				<button
					type="button"
					class="btn chip"
					class:chip--active={chip === value}
					aria-pressed={chip === value}
					onclick={() => onchange(chip)}
				>
					{format(chip)}
				</button>
			{/each}
		</div>
	{/if}
</fieldset>

<style>
	.field {
		display: grid;
		gap: var(--sp-2);
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.label {
		padding: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.row {
		display: grid;
		grid-template-columns: var(--tap) 1fr var(--tap);
		align-items: center;
		gap: var(--sp-2);
	}

	.step {
		width: var(--tap);
		min-width: var(--tap);
		padding: 0;
		border-radius: var(--radius-pill);
	}

	.value {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-align: center;
		color: var(--color-text);
	}

	/* Grid, not flex-wrap: a wrapped flex row stretches its last chip to full width. */
	.chips {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(3.25rem, 1fr));
		gap: var(--sp-2);
	}

	.chip {
		min-height: 36px;
		padding: var(--sp-1) var(--sp-3);
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
		border-radius: var(--radius-pill);
		border-color: var(--color-border);
		color: var(--color-text-muted);
	}

	.chip--active {
		color: var(--color-on-accent);
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.chip--active:hover {
		background: var(--color-accent);
	}
</style>
