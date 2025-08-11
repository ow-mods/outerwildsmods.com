<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModCardDetails from './mod-card-details.svelte';
	import ModCardImage from './mod-card-image.svelte';

	interface Props {
		mod: Mod;
		lazy?: boolean;
		hideDescription?: boolean;
		showDetails?: boolean;
	}

	let {
		mod,
		lazy = false,
		hideDescription = false,
		showDetails = false
	}: Props = $props();

	let pointer = $state(false);
	let touch = $state(false);
</script>

<div
	onpointerenter={() => (pointer = true)}
	onpointerleave={() => (pointer = false)}
	ontouchstart={() => (touch = true)}
	ontouchend={() => (touch = false)}
	class="group link mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background flex flex-col justify-start max-w-sm"
>
	<ModCardImage {mod} {lazy} hover={!hideDescription && (pointer || touch || showDetails)} />
	<ModCardDetails {mod} showInstallButton={!hideDescription}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
</div>
