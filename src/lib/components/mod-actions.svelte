<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-database';
	import LinkButton from './link-button.svelte';

	export let mod: Mod;
	export let isFullWidth = false;
</script>

<div class:wrapper={!isFullWidth} class:flex-1={isFullWidth} class="flex-0 p-4 bg-dark rounded">
	<div class="sticky top-2 w-52 m-auto">
		<div>
			<h1 class="m-0 text-2xl">{mod.name}</h1>
			<a class="link" href={mod.repo} target="_blank" rel="noopener noreferrer">
				by {mod.author}
			</a>
			<p>{mod.description}</p>
			<div>
				<small>Downloaded {mod.downloadCount} times</small>
			</div>
		</div>
		<div class="buttonsWrapper">
			<div class="h-8" />
			<LinkButton href="/mod-manager" primary>Install mod using Mod Manager</LinkButton>
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
