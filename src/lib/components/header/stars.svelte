<script lang="ts">
	import type { StarDataResponse } from 'src/routes/api/stars/+server';

	export let starData: StarDataResponse | undefined;
</script>

{#if starData}
	<svg
		class="starLayer starLayer1"
		preserveAspectRatio="xMinYMin slice"
		viewBox={`0 0 ${starData.width} ${starData.height}`}
	>
		{#each starData.starData1 as star (star.id)}
			<circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
		{/each}
	</svg>
	<svg
		class="starLayer starLayer2"
		preserveAspectRatio="xMinYMin slice"
		viewBox={`0 0 ${starData.width} ${starData.height}`}
		fill="white"
	>
		{#each starData.starData2 as star (star.id)}
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
{/if}
