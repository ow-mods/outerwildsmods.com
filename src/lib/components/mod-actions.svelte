<script lang="ts">
	import type { Mod } from '$lib/helpers';
	import LinkButton from './link-button.svelte';
	import SmartLink from './smart-link.svelte';

	export let mod: Mod;
	export let isFullWidth = false;
</script>

<div class:wrapper={!isFullWidth} class:flex-1={isFullWidth} class="flex-0 p-4 bg-dark rounded">
	<div class="sticky top-2 w-52 m-auto">
		<div>
			<h1 class="m-0 text-2xl">{mod.name}</h1>
			<SmartLink isExternal href={mod.repo}>by {mod.author}</SmartLink>
			<p>{mod.description}</p>
			<div>
				<small>Downloaded {mod.downloadCount} times</small>
			</div>
		</div>
		<div class="buttonsWrapper">
			<div class="h-8" />
			<LinkButton href="/mod-manager" variant="primary">Install mod using Mod Manager</LinkButton>
			<div class="h-8" />
			<LinkButton href={mod.downloadUrl}>
				<small>
					<div>Download mod files</div>
					<div>Version {mod.version}</div>
				</small>
			</LinkButton>
		</div>
	</div>
</div>

<style>
	/* .wrapper {
		min-width: 250px;
		max-width: 250px;
	} */
</style>
