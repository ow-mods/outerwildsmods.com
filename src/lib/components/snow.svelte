<script lang="ts">
	const snowflakeCount = 50;
	const snowflakes = Array.from({ length: snowflakeCount }).map((_, i) => {
		const random = (seed: number) => {
			const x = Math.sin(i + seed) * 10000;
			return x - Math.floor(x);
		};
		return {
			left: random(0) * 100,
			animationDuration: 20 + random(1) * 40,
			swayDuration: 3 + random(2) * 4,
			animationDelay: -(random(3) * 30),
			opacity: 0.3 + random(4) * 0.5,
		};
	});
</script>

<div class="snow-container" aria-hidden="true">
	{#each snowflakes as flake}
		<div
			class="snowflake-wrapper"
			style="left: {flake.left}%; animation-duration: {flake.animationDuration}s; animation-delay: {flake.animationDelay}s;"
		>
			<div
				class="snowflake"
				style="opacity: {flake.opacity}; animation-duration: {flake.swayDuration}s; animation-delay: {flake.animationDelay}s;"
			></div>
		</div>
	{/each}
</div>

<style>
	.snow-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
		overflow: hidden;
	}

	.snowflake-wrapper {
		position: absolute;
		top: -10px;
		animation: fall linear infinite;
	}

	.snowflake {
		width: 3px;
		height: 3px;
		background: white;
		border-radius: 50%;
		animation: sway ease-in-out infinite alternate;
	}

	@keyframes fall {
		0% {
			transform: translateY(-10vh);
		}
		100% {
			opacity: 0;
			transform: translateY(110vh);
		}
	}

	@keyframes sway {
		0% {
			transform: translateX(-30px);
		}
		100% {
			transform: translateX(30px);
		}
	}
</style>
