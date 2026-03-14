<script lang="ts">
	import logo from '$lib/assets/no-bg-logo.png';

</script>

<div class="background-branding" aria-hidden="true">
	<div class="branding-center">
		<div class="branding-unit">
			<svg class="arch-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
	<div class="bottom-name">AHMET TAŞÇI</div>
</div>

<style>
	.background-branding {
		position: absolute;
		inset: 0;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: calc(3rem + env(safe-area-inset-top, 0)) 1.25rem
			calc(1.75rem + env(safe-area-inset-bottom, 0));
		z-index: 0;
	}

	.branding-center {
		flex: 1;
		display: grid;
		place-items: center;
		min-height: 0;
		width: 100%;
	}

	.branding-unit {
		--branding-size: clamp(18rem, 56vmin, 38rem);
		position: relative;
		width: var(--branding-size);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}

	.arch-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.logo {
		width: 72%;
		height: auto;
		opacity: 0.5;
		object-fit: contain;
	}

	.arch-text {
		font-family: var(--font-body);
		font-size: 6px;
		font-weight: 700;
		letter-spacing: 0.12em;
		fill: var(--color-text-muted);
		opacity: 0.6;
	}

	.bottom-name {
		font-family: var(--font-body);
		font-size: clamp(1.5rem, 4.5vmin, 2.25rem);
		font-weight: 600;
		letter-spacing: 0.18em;
		color: var(--color-text-muted);
		opacity: 0.6;
		text-align: center;
	}

	@media (max-width: 640px) {
		.branding-unit {
			--branding-size: clamp(17rem, 72vw, 28rem);
		}

		.logo {
			width: 74%;
		}

		.arch-text {
			font-size: 5.25px;
			letter-spacing: 0.09em;
		}
	}
</style>
