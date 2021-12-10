<script lang="ts">
	import { listedImageSize } from '$lib/helpers/constants';

	import { getHueFromText } from '$lib/helpers/get-hue-from-name';

	export let title: string;
	export let description: string | undefined;
	export let index: number;
	export let imageUrl: string | undefined;
</script>

<div
	class="bg-dark w-72 m-2 rounded-lg overflow-hidden hover:bg-background border-4 border-background hover:border-dark"
>
	<div class="relative" style={imageUrl ? undefined : getHueFromText(title)}>
		{#if !imageUrl}
			<div
				class="absolute flex justify-center items-center h-full w-full opacity-20 text-white text-2xl p-3 text-center"
			>
				{title}
			</div>
		{/if}
		<img
			class="object-cover object-left"
			alt={title}
			src={imageUrl || '/images/placeholder.jpg'}
			loading={!imageUrl || index <= 3 ? 'eager' : 'lazy'}
			width={listedImageSize.width}
			height={listedImageSize.height}
		/>
	</div>
	<div class="p-3">
		<span>{title}</span>
		{#if description}
			<div class="leading-tight">
				<span class="text-light">
					<small>{description} </small>
				</span>
			</div>
		{/if}
	</div>
</div>
