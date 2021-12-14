<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-database';
	import CtaButton from './button/cta-button.svelte';
	import LinkButton from './button/link-button.svelte';

	export let mod: Mod;
	export let isFullWidth = false;
</script>

<div class:wrapper={!isFullWidth} class:flex-1={isFullWidth} class="flex-0 p-4 bg-dark rounded">
	<div class="sticky top-2 lg:w-52 m-auto">
		<div class="flex flex-col gap-2">
			<h1 class="m-0 text-2xl">{mod.name}</h1>
			<a class="link" href={mod.repo} target="_blank" rel="noopener noreferrer">
				by {mod.author}
			</a>
			<p class="m-0">{mod.description}</p>
			<small>Downloaded {mod.downloadCount} times</small>
			<div class="flex flex-col gap-4">
				<CtaButton href="/mod-manager">Install mod using Mod Manager</CtaButton>
				<LinkButton href={mod.downloadUrl}>
					<small>
						<div>Download mod files</div>
						<div>Version {mod.version}</div>
					</small>
				</LinkButton>
			</div>
		</div>
	</div>
</div>
