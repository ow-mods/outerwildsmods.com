<script lang="ts">
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import { onMount } from 'svelte';
	import NavigationLink from './navigation/navigation-link.svelte';

	const fallbackImage = '/images/header/video-placeholder.webp';

	let imageSource = fallbackImage;
	onMount(() => {
		if ('ImageDecoder' in window) {
			imageSource = '/images/header/video.avif';
		} else {
			imageSource = '/images/header/video.webp';
		}
	});
</script>

<header class="text-center overflow-hidden bg-black">
	<div class="gradient">
		<div class="max-w-screen-md m-auto relative background">
			<div class="p-4 text-4xl m-0">
				<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
			</div>
			<picture>
				<source srcset={imageSource} type="image/avif" />
				<source srcset="/images/header/video.webp" type="image/webp" />
				<img
					src="/images/header/video-placeholder.webp"
					alt=""
					class="mix-blend-screen pointer-events-none absolute top-0 right-0 h-full object-contain -mr-16"
					on:error={() => {
						imageSource = fallbackImage;
					}}
				/>
			</picture>
			<Navigation>
				<NavigationLink href="/" exact>Home</NavigationLink>
				<NavigationLink href="/mod-manager">Manager</NavigationLink>
				<NavigationLink href="/mods">Mods</NavigationLink>
				<NavigationLink href="/jam">Jams</NavigationLink>
				<NavigationLink href="/outer-wilds-alpha">Alpha</NavigationLink>
			</Navigation>
		</div>
	</div>
</header>

<style>
	header {
		background-image: url(/images/header/background.png);
		/* this must be set to auto so that we know the real pixel size of the background image, to be able to animate it perfectly */
		background-size: auto;
		background-position: center;
		animation: slide 120s linear infinite;
	}
	.background {
		background-image: url(/images/header/video-mask.webp);
		background-size: contain;
		background-repeat: no-repeat;
		background-position-x: right;
		background-position-y: bottom;
	}
	.gradient {
		background: radial-gradient(circle, transparent 30%, black 100%);
	}
	@keyframes slide {
		0% {
			background-position-x: 0;
		}
		100% {
			/* this offset value must match the width of the background image in the .background class */
			background-position-x: -460px;
		}
	}
</style>
