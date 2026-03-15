<script lang="ts">
	interface Props {
		id?: string;
		min?: number;
		max?: number;
		step?: number;
		value: number;
		disabled?: boolean;
		onchange?: (value: number) => void;
	}

	let {
		id,
		min = 0,
		max = 3600,
		step = 15,
		value,
		disabled = false,
		onchange
	}: Props = $props();

	const ROW_HEIGHT = 44;
	const ROW_HEIGHT_COMPACT = 34;
	const NUM_BANDS = 3;

	const minuteCount = 60;
	const secondCount = $derived(Math.floor(60 / step));

	const minuteValues = $derived(Array.from({ length: minuteCount }, (_, i) => i));
	const secondValues = $derived(
		Array.from({ length: secondCount }, (_, i) => i * step)
	);

	const currentMinutes = $derived(Math.floor(value / 60) % 60);
	const currentSeconds = $derived(
		(Math.round((value % 60) / step) * step) % 60
	);

	function clampValue(totalSeconds: number): number {
		const snapped = Math.round(totalSeconds / step) * step;
		return Math.min(max, Math.max(min, snapped));
	}

	let minutesEl: HTMLDivElement | undefined = $state();
	let secondsEl: HTMLDivElement | undefined = $state();
	let isDesktop = $state(false);
	let isCompact = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
		isDesktop = mq.matches;
		const handler = () => {
			isDesktop = mq.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(orientation: landscape) and (max-height: 500px)');
		isCompact = mq.matches;
		const handler = () => {
			isCompact = mq.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	const rowHeight = $derived(isCompact ? ROW_HEIGHT_COMPACT : ROW_HEIGHT);

	const minuteBandHeight = $derived(minuteCount * rowHeight);
	const secondBandHeight = $derived(secondCount * rowHeight);

	function minuteIndexToScrollTop(valueIndex: number): number {
		return (minuteCount + valueIndex) * rowHeight;
	}

	function secondIndexToScrollTop(valueIndex: number): number {
		return (secondCount + valueIndex) * rowHeight;
	}

	function scrollTopToMinuteValue(scrollTop: number): number {
		const idx = Math.round(scrollTop / rowHeight);
		return ((idx % minuteCount) + minuteCount) % minuteCount;
	}

	function scrollTopToSecondValue(scrollTop: number): number {
		const idx = Math.round(scrollTop / rowHeight);
		const valueIndex = ((idx % secondCount) + secondCount) % secondCount;
		return secondValues[valueIndex];
	}

	function recenterMinutesScroll() {
		if (!minutesEl) return;
		const st = minutesEl.scrollTop;
		const idx = Math.round(st / rowHeight);
		if (idx < minuteCount) {
			minutesEl.scrollTop = st + minuteBandHeight;
		} else if (idx >= 2 * minuteCount) {
			minutesEl.scrollTop = st - minuteBandHeight;
		}
	}

	function recenterSecondsScroll() {
		if (!secondsEl) return;
		const st = secondsEl.scrollTop;
		const idx = Math.round(st / rowHeight);
		if (idx < secondCount) {
			secondsEl.scrollTop = st + secondBandHeight;
		} else if (idx >= 2 * secondCount) {
			secondsEl.scrollTop = st - secondBandHeight;
		}
	}

	$effect(() => {
		void currentMinutes;
		void currentSeconds;
		editingMinutes = null;
		editingSeconds = null;
	});

	$effect(() => {
		if (editingMinutes !== null || editingSeconds !== null) return;
		const m = currentMinutes;
		const s = currentSeconds;
		const sIdx = secondValues.indexOf(s);
		if (minutesEl) {
			minutesEl.scrollTop = minuteIndexToScrollTop(m);
		}
		if (secondsEl && sIdx >= 0) {
			secondsEl.scrollTop = secondIndexToScrollTop(sIdx);
		}
	});

	function handleMinutesScroll() {
		if (!minutesEl || !onchange || disabled) return;
		recenterMinutesScroll();
		const m = scrollTopToMinuteValue(minutesEl.scrollTop);
		const total = m * 60 + currentSeconds;
		onchange(clampValue(total));
	}

	function handleSecondsScroll() {
		if (!secondsEl || !onchange || disabled) return;
		recenterSecondsScroll();
		const s = scrollTopToSecondValue(secondsEl.scrollTop);
		const total = currentMinutes * 60 + s;
		onchange(clampValue(total));
	}

	let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
	function scheduleScrollEnd(fn: () => void) {
		if (scrollTimeout) clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			scrollTimeout = null;
			fn();
		}, 150);
	}

	function onMinutesScroll() {
		recenterMinutesScroll();
		scheduleScrollEnd(handleMinutesScroll);
	}

	function onSecondsScroll() {
		recenterSecondsScroll();
		scheduleScrollEnd(handleSecondsScroll);
	}

	function selectMinute(m: number) {
		if (disabled || !onchange) return;
		onchange(clampValue(m * 60 + currentSeconds));
	}

	function selectSecond(s: number) {
		if (disabled || !onchange) return;
		onchange(clampValue(currentMinutes * 60 + s));
	}

	function handleOptionKeydown(event: KeyboardEvent, onSelect: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect();
		}
	}

	let editingMinutes = $state<string | null>(null);
	let editingSeconds = $state<string | null>(null);

	function handleMinutesFocus() {
		editingMinutes = String(currentMinutes);
	}

	function handleMinutesInput(e: Event) {
		editingMinutes = (e.currentTarget as HTMLInputElement).value;
	}

	function handleMinutesBlur(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const v = parseInt(input.value, 10);
		editingMinutes = null;
		if (!Number.isNaN(v) && v >= 0 && v < 60 && onchange) {
			const m = v % 60;
			const total = m * 60 + currentSeconds;
			onchange(clampValue(total));
		}
	}

	function handleSecondsFocus() {
		editingSeconds = String(currentSeconds).padStart(2, '0');
	}

	function handleSecondsInput(e: Event) {
		editingSeconds = (e.currentTarget as HTMLInputElement).value;
	}

	function handleSecondsBlur(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const v = parseInt(input.value, 10);
		editingSeconds = null;
		if (!Number.isNaN(v) && v >= 0 && v < 60 && onchange) {
			const snapped = Math.round(v / step) * step;
			const s = secondValues.includes(snapped) ? snapped : secondValues[0];
			const total = currentMinutes * 60 + s;
			onchange(clampValue(total));
		}
	}

	const minuteBandItems = $derived(
		Array.from({ length: minuteCount * NUM_BANDS }, (_, i) => minuteValues[i % minuteCount])
	);
	const secondBandItems = $derived(
		Array.from({ length: secondCount * NUM_BANDS }, (_, i) => secondValues[i % secondCount])
	);
</script>

<div class="scroll-picker" class:disabled {id} role="group">
	<div class="picker-mask">
		<div class="picker-column" role="listbox" aria-label="Minutes">
			<div
				class="picker-scroll"
				bind:this={minutesEl}
				onscroll={onMinutesScroll}
				role="list"
			>
				<div class="picker-spacer" aria-hidden="true"></div>
				{#each minuteBandItems as m, i}
					<div
						class="picker-item"
						class:selected={m === currentMinutes}
						role="option"
						aria-selected={m === currentMinutes}
						tabindex={disabled ? -1 : 0}
						onclick={() => selectMinute(m)}
						onkeydown={(e) => handleOptionKeydown(e, () => selectMinute(m))}
					>
						{#if isDesktop && m === currentMinutes && i >= minuteCount && i < 2 * minuteCount}
							<input
								type="number"
								class="picker-input"
								min={0}
								max={59}
								value={editingMinutes ?? String(currentMinutes)}
								disabled={disabled}
								onfocus={handleMinutesFocus}
								oninput={handleMinutesInput}
								onblur={handleMinutesBlur}
								onkeydown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
							/>
						{:else}
							{m.toString().padStart(2, '0')}
						{/if}
					</div>
				{/each}
				<div class="picker-spacer" aria-hidden="true"></div>
			</div>
		</div>
		<span class="picker-separator" aria-hidden="true">:</span>
		<div class="picker-column" role="listbox" aria-label="Seconds">
			<div
				class="picker-scroll"
				bind:this={secondsEl}
				onscroll={onSecondsScroll}
				role="list"
			>
				<div class="picker-spacer" aria-hidden="true"></div>
				{#each secondBandItems as s, i}
					<div
						class="picker-item"
						class:selected={s === currentSeconds}
						role="option"
						aria-selected={s === currentSeconds}
						tabindex={disabled ? -1 : 0}
						onclick={() => selectSecond(s)}
						onkeydown={(e) => handleOptionKeydown(e, () => selectSecond(s))}
					>
						{#if isDesktop && s === currentSeconds && i >= secondCount && i < 2 * secondCount}
							<input
								type="number"
								class="picker-input"
								min={0}
								max={59}
								value={editingSeconds ?? String(currentSeconds).padStart(2, '0')}
								disabled={disabled}
								onfocus={handleSecondsFocus}
								oninput={handleSecondsInput}
								onblur={handleSecondsBlur}
								onkeydown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
							/>
						{:else}
							{s.toString().padStart(2, '0')}
						{/if}
					</div>
				{/each}
				<div class="picker-spacer" aria-hidden="true"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-picker {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 132px;
		user-select: none;
	}

	.scroll-picker.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	.picker-mask {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		background: var(--color-bg-input);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.35rem 0.65rem;
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
	}

	.picker-mask::before {
		content: '';
		position: absolute;
		left: 0.25rem;
		right: 0.25rem;
		top: 50%;
		height: 44px;
		transform: translateY(-50%);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
		pointer-events: none;
		z-index: 0;
	}

	.picker-column {
		height: 132px;
		overflow: hidden;
		position: relative;
		z-index: 1;
	}

	.picker-column::before,
	.picker-column::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 44px;
		pointer-events: none;
		z-index: 2;
	}

	.picker-column::before {
		top: 0;
		background: linear-gradient(
			to bottom,
			var(--color-bg-input) 0%,
			transparent 70%
		);
	}

	.picker-column::after {
		bottom: 0;
		background: linear-gradient(
			to top,
			var(--color-bg-input) 0%,
			transparent 70%
		);
	}

	.picker-scroll {
		height: 100%;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		scrollbar-width: none;
		-ms-overflow-style: none;
		overscroll-behavior: contain;
	}

	.picker-scroll::-webkit-scrollbar {
		display: none;
	}

	.picker-spacer {
		height: 44px;
		min-height: 44px;
	}

	.picker-item {
		height: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-muted);
		opacity: 0.6;
		scroll-snap-align: center;
		scroll-snap-stop: always;
		cursor: pointer;
		transition: opacity 0.15s, color 0.15s;
	}

	.picker-item.selected {
		color: var(--color-primary);
		opacity: 1;
	}

	.picker-input {
		width: 2.75ch;
		min-width: 2.75ch;
		box-sizing: border-box;
		font: inherit;
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1.2;
		color: inherit;
		background: color-mix(in srgb, var(--color-bg-input) 70%, transparent);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		padding: 0.15rem 0.2rem;
		text-align: center;
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.picker-input::-webkit-outer-spin-button,
	.picker-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.picker-input:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}

	.picker-separator {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--color-text-muted);
		z-index: 1;
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.scroll-picker {
			min-height: 100px;
		}

		.picker-column {
			height: 100px;
		}

		.picker-mask::before {
			height: 34px;
		}

		.picker-column::before,
		.picker-column::after {
			height: 34px;
		}

		.picker-spacer {
			height: 34px;
			min-height: 34px;
		}

		.picker-item {
			height: 34px;
			min-height: 34px;
			font-size: 1rem;
		}

		.picker-input {
			width: 2.5ch;
			min-width: 2.5ch;
			font-size: 1rem;
			padding: 0.1rem 0.15rem;
		}
	}
</style>
