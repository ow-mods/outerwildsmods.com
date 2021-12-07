<script lang="ts">
	import {
		ItemWrapper,
		ImageWrapper,
		Title,
		DescriptionWrapper,
		Description,
		TextWrapper,
		PlaceholderText
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
</script>

<span class={ItemWrapper}>
	<div class={ImageWrapper(imageUrl ? 0 : stringToNumber(title))}>
		{#if !imageUrl}
			<div class={PlaceholderText}>{title}</div>
		{/if}
		<img alt={title} src={imageUrl || '/images/placeholder.jpg'} height={200} width={560} />
		<!-- layout="intrinsic"
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
</span>
