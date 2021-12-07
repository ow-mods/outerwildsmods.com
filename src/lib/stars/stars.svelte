<script lang="ts">
	import { starLayer, starLayer1, starLayer2 } from './stars.styles';

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
			id: i
		});
		starData2.push({
			x: random(0, width, 1),
			y: random(0, height, 1),
			opacity: random(0.1, 0.8, 10),
			radius: random(0.1, 1.2, 10),
			id: i
		});
	}
</script>

<svg
	class={[starLayer, starLayer1].join(' ')}
	preserveAspectRatio="xMinYMin slice"
	viewBox={`0 0 ${width} ${height}`}
>
	{#each starData1 as star}
		<circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
	{/each}
</svg>
<svg
	class={[starLayer, starLayer2].join(' ')}
	preserveAspectRatio="xMinYMin slice"
	viewBox={`0 0 ${width} ${height}`}
	fill="white"
>
	{#each starData2 as star}
		<circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
	{/each}
</svg>
