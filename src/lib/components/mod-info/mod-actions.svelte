<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import CtaButton from '../button/cta-button.svelte';
	import LinkButton from '../button/link-button.svelte';
	import GithubCorner from '../header/github-corner.svelte';

	export let mod: ModsRequestItem;
</script>

<div class="bg-dark rounded p-4 mb-4 relative overflow-hidden">
	<GithubCorner href={mod.repo} tooltip="{mod.name} source code" />
	<div class="flex flex-col gap-4">
		<div>
			<h1 class="m-0 text-2xl break-words">{mod.name}</h1>
			<div class="text-sm">
				by <a class="link" href="https://github.com/{mod.author}">{mod.author}</a>
			</div>
		</div>
		<p class="m-0 break-words">{mod.description}</p>
		<a class="link text-sm" href="./downloads/">
			<span data-nosnippet title="{mod.name} download history"
				>{mod.formattedDownloadCount} downloads</span
			>
		</a>
		<div class="flex flex-col gap-4">
			<CtaButton href="/mod-manager">
				<div>
					<div>Mod Manager</div>
				</div>
			</CtaButton>
			<LinkButton href="outer-wilds-mod://{mod.uniqueName}" isExternal>
				<div>
					<div>Install Mod</div>
					<div class="text-xs text-light opacity-50">(Mod Manager required)</div>
				</div>
			</LinkButton>
			<a class="link text-sm mt-2" href={mod.downloadUrl}>
				Download mod zip ({mod.version})
			</a>
		</div>
	</div>
</div>
