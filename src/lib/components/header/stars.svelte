<script lang="ts">
	type StarData = {
		x: number;
		y: number;
		opacity: number;
		radius: number;
		id: number;
	};

	const width = 2000;
	const height = 150;
	const starCount = 80;

	const round = (value: number, magnitude: number) => Math.round(value * magnitude) / magnitude;

	const random = (min: number, max: number, roundMagnitude: number) =>
		round(Math.random() * (max - min) + min, roundMagnitude);

	const starData1: StarData[] = [];
	const starData2: StarData[] = [];

	for (let i = 0; i < starCount; i++) {
		starData1.push({
			x: random(0, width, 1),
			y: random(0, height, 1),
			opacity: random(0.1, 0.8, 10),
			radius: random(0.1, 1.2, 10),
			id: i,
		});
		starData2.push({
			x: random(0, width, 1),
			y: random(0, height, 1),
			opacity: random(0.1, 0.8, 10),
			radius: random(0.1, 1.2, 10),
			id: i,
		});
	}
</script>

<svg
	class="starLayer starLayer1"
	preserveAspectRatio="xMinYMin slice"
	viewBox={`0 0 ${width} ${height}`}
>
	{#each starData1 as star (star.id)}
		<circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
	{/each}
</svg>
<svg
	class="starLayer starLayer2"
	preserveAspectRatio="xMinYMin slice"
	viewBox={`0 0 ${width} ${height}`}
	fill="white"
>
	{#each starData2 as star (star.id)}
		<circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
	{/each}
</svg>

<style>
	.starLayer {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		height: calc(100% + 50px);
		margin-top: -25px;
		animation-delay: -5s;
		animation-duration: 30s;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		animation-timing-function: ease-in-out;
		fill: white;
	}

	.starLayer1 {
		--animation-movement: 200px;

		width: calc(100% + var(--animation-movement));
		animation-name: starMovement1;
	}

	@keyframes starMovement1 {
		from {
			transform: rotateZ(-2deg) translateX(calc(var(--animation-movement) * -1));
		}
		to {
			transform: rotateZ(2deg) translateX(0);
		}
	}

	.starLayer2 {
		--animation-movement: 300px;

		width: calc(100% + var(--animation-movement));
		animation-name: starMovement2;
	}

	@keyframes starMovement2 {
		from {
			transform: rotateZ(-3deg) translateX(calc(var(--animation-movement) * -1));
		}
		to {
			transform: rotateZ(3deg) translateX(0);
		}
	}
</style>
