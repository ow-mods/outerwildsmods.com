<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { getDateText, type HistoryPoint } from '$lib/helpers/api/history-points';

	const tooltipOffset = {
		x: -200,
		y: 30,
	} as const;

	export let mod: Mod;
	export let compareWithMod: Mod | null;
	export let mousePosition = {
		x: 0,
		y: 0,
	};
	export let hoveredPoint: HistoryPoint | null = null;
	export let hoveredPointCompare: HistoryPoint | null = null;
</script>

<div
	class="text-center bg-darker bg-opacity-60 p-2 rounded z-10 min-w-max"
	style="left: {mousePosition.x + tooltipOffset.x}px; top: {mousePosition.y + tooltipOffset.y}px"
>
	<div class="justify-center">
		{#if hoveredPoint}
			<div class="text-accent">
				{mod.name}: {hoveredPoint?.DownloadCount}
			</div>
		{/if}
		{#if hoveredPointCompare && compareWithMod}
			<div class="text-cta">
				{compareWithMod.name}: {hoveredPointCompare.DownloadCount}
			</div>
		{/if}
	</div>
	<div class="text-light">
		{#if hoveredPoint}
			{getDateText(hoveredPoint)}
		{/if}
		{#if hoveredPointCompare && !hoveredPoint}
			{getDateText(hoveredPointCompare)}
		{/if}
	</div>
</div>
