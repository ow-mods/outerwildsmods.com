<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import CtaButton from '../button/cta-button.svelte';
	import LinkButton from '../button/link-button.svelte';

	export let mod: ModsRequestItem;
</script>

<div class="bg-dark rounded p-4 mb-4">
	<div class="flex flex-col gap-2">
		<h1 class="m-0 text-2xl break-words">{mod.name}</h1>
		<a class="link break-words" href={mod.repo} target="_blank" rel="noopener noreferrer">
			by {mod.author}
		</a>
		<p class="m-0 break-words">{mod.description}</p>
		<a class="link text-sm" href="./downloads/">
			<span data-nosnippet>↓ {mod.formattedDownloadCount}</span>
		</a>
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
