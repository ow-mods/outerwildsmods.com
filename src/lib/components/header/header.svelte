<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import NavigationLink from '../navigation/navigation-link.svelte';

	let video: HTMLVideoElement | undefined;
	$: {
		if (video) {
			video.playbackRate = 0.3;
		}
	}
</script>

<header class="text-center overflow-hidden">
	<GithubCorner href="https://github.com/ow-mods" tooltip="Outer Wilds Mods ecosystem on GitHub" />
	<div>
		<div class="max-w-screen-lg m-auto relative background">
			<div class="mix-blend-screen">
				<div class="video-gradient absolute w-full h-full z-10" />
				<video
					autoplay
					muted
					loop
					bind:this={video}
					class="absolute w-full object-contain object-right h-full"
				>
					<source src="/images/header-planet.mp4" type="video/mp4" />
				</video>
			</div>
			<div class="p-4 text-4xl m-0">
				<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
			</div>
			<Navigation>
				<NavigationLink href="/" exact>Home</NavigationLink>
				<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
				<NavigationLink href="/mods">Mods</NavigationLink>
				<NavigationLink href="/jam">Jam</NavigationLink>
				<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
			</Navigation>
		</div>
	</div>
</header>

<style>
	header {
		background-image: url(/images/header-stars.webp);
		/* this must be set to auto so that we know the real pixel size of the background image, to be able to animate it perfectly */
		background-size: auto;
		background-position: center;
		animation: slide 60s linear infinite;
	}
	.background {
		background-image: url(/images/header-planet.webp);
		background-size: contain;
		background-repeat: no-repeat;
		background-position-x: right;
		background-position-y: bottom;
	}
	.gradient {
		background: radial-gradient(circle, transparent 30%, black 100%);
	}
	.video-gradient {
		background: linear-gradient(90deg, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 1) 100%);
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
