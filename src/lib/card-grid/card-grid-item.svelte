<script lang="ts">
	import {
		ItemWrapper,
		ImageWrapper,
		Title,
		DescriptionWrapper,
		Description,
		TextWrapper,
		PlaceholderText,
		ItemImage
	} from './card-grid.styles';

	const stringToNumber = function (str: string, seed = 3) {
		let h1 = 0xdeadbeef ^ seed,
			h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
		return (4294967296 * (2097151 & h2) + (h1 >>> 0)) % 360;
	};

	export let title: string;
	export let description: string | undefined;
	export let index: number;
	export let imageUrl: string | undefined;
	let hue = imageUrl ? 0 : stringToNumber(title);
</script>

<div class="flex-col bg-gray-800 w-72 m-2 rounded-md overflow-hidden hover:bg-gray-700">
	<div style={`filter: hue-rotate(${hue}deg);`}>
		{#if !imageUrl}
			<div class={PlaceholderText}>{title}</div>
		{/if}
		<img
			class="h-24 w-full object-cover object-left"
			alt={title}
			src={imageUrl || '/images/placeholder.jpg'}
		/>
		<!-- layout="intrinsic"
				height={200}
				width={560}
			objectFit="cover"
			priority={index <= 6}
			quality={imageUrl ? 50 : 100} -->
	</div>
	<div class={TextWrapper}>
		<span class={Title}>{title}</span>
		{#if description}
			<div class={DescriptionWrapper}>
				<span class={Description}>
					<small>{description} </small>
				</span>
			</div>
		{/if}
	</div>
</div>
