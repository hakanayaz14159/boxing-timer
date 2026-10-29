<script lang="ts">
	import logo from '$lib/assets/no-bg-logo.png';

	interface Props {
		/** Dim once a round is running so the digits stay dominant. */
		dimmed: boolean;
	}

	let { dimmed }: Props = $props();
</script>

<!--
	Out of the page grid. A corner watermark, behind the content, so it cannot
	change the header, the clock, or the controls.
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
					<path id="arch-path" d="M 14,75.2 A 44,44 0 1 1 86,75.2" />
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
</div>

<style>
	.branding {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		padding-top: env(safe-area-inset-top, 0);
		pointer-events: none;
	}

	.watermark {
		opacity: 0.92;
		transition: opacity var(--motion-slow) var(--ease);
	}

	/*
	 * Still clearly present mid-round, but stepped back from the config level so
	 * the digits, read from several metres away, stay the dominant element.
	 */
	.watermark--dimmed {
		opacity: 0.75;
	}

	.unit {
		container-type: inline-size;
		position: relative;
		display: grid;
		place-items: center;
		/* 8% margin: the arch glyphs extend past the viewBox, and the corner
		   would clip them otherwise. */
		--mark: clamp(12rem, 40vmin, 22rem);
		width: var(--mark);
		margin-top: calc(var(--mark) * 0.08);
		margin-left: calc(var(--mark) * 0.08);
		aspect-ratio: 1;
	}

	.arch {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* Sized to the longer arch: big enough to read, still short enough that
	   the whole phrase stays on the path. */
	.arch-text {
		font-family: var(--font-body);
		font-size: 2.5cqw;
		font-weight: 700;
		letter-spacing: 0.01em;
		fill: var(--color-text-muted);
	}

	.logo {
		width: 72%;
		height: auto;
		object-fit: contain;
	}

	@media (max-width: 800px) {
		.unit {
			--mark: min(22rem, 46vw);
		}
	}

	@media (max-height: 500px) {
		.unit {
			--mark: min(14rem, 36svh);
		}
	}
</style>
