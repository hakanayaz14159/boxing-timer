<script lang="ts">
	import logo from '$lib/assets/no-bg-logo.png';

	interface Props {
		/** Recede behind the countdown while a round is running. */
		dimmed: boolean;
	}

	let { dimmed }: Props = $props();
</script>

<!--
	`display: contents` so the page grid places these two pieces directly: the
	watermark shares the stage cell with the countdown, the wordmark gets a row of
	its own. Neither is absolutely positioned, so neither can land on a control.
-->
<div class="branding" aria-hidden="true">
	<div class="watermark" class:watermark--dimmed={dimmed}>
		<div class="unit">
			<svg
				class="arch"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
			>
				<defs>
					<path id="arch-path" d="M 6,50 A 44,44 0 0 1 94,50" />
				</defs>
				<text class="arch-text">
					<textPath href="#arch-path" startOffset="50%" text-anchor="middle">
						DENİZLİ BOKS İL TEMSİLCİLİĞİ
					</textPath>
				</text>
			</svg>
			<img src={logo} alt="" class="logo" />
		</div>
	</div>

	<div class="wordmark">AHMET TAŞÇI</div>
</div>

<style>
	.branding {
		display: contents;
	}

	/* Spans every row so the mark is centred on the page rather than on one
	   region, and sits behind all content. */
	.watermark {
		grid-row: 1 / -1;
		grid-column: 1 / -1;
		display: grid;
		place-items: center;
		min-width: 0;
		min-height: 0;
		opacity: 0.4;
		pointer-events: none;
		transition: opacity var(--motion-slow) var(--ease);
	}

	/*
	 * Still clearly present mid-round, but stepped back from the config level so
	 * the digits, read from several metres away, stay the dominant element.
	 */
	.watermark--dimmed {
		opacity: 0.22;
	}

	.unit {
		position: relative;
		display: grid;
		place-items: center;
		width: min(92vmin, 60rem);
		aspect-ratio: 1;
		max-height: 100%;
	}

	.arch {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.arch-text {
		font-family: var(--font-body);
		font-size: 6px;
		font-weight: 700;
		letter-spacing: 0.12em;
		fill: var(--color-text-muted);
	}

	.logo {
		width: 72%;
		height: auto;
		object-fit: contain;
	}

	.wordmark {
		grid-area: brand;
		padding-bottom: env(safe-area-inset-bottom, 0);
		font-size: clamp(1rem, 4vmin, 1.75rem);
		font-weight: 600;
		letter-spacing: 0.18em;
		text-align: center;
		color: var(--color-text-muted);
	}

	@media (max-height: 500px) {
		.wordmark {
			font-size: var(--text-sm);
			letter-spacing: 0.12em;
		}

		.arch-text {
			font-size: 5.25px;
			letter-spacing: 0.09em;
		}
	}
</style>
