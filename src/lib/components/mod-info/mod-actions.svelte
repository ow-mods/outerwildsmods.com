<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import CtaButton from '../button/cta-button.svelte';
	import LinkButton from '../button/link-button.svelte';

	export let mod: ModsRequestItem;
</script>

<div class="bg-dark rounded p-4 mb-4 relative overflow-hidden">
	<div class="flex flex-col gap-4">
		<h1 class="m-0 leading-none text-2xl break-words">{mod.name}</h1>
		<p class="m-0 leading-none break-words text-sm">{mod.description}</p>
		<div class="flex flex-col gap-4">
			<CtaButton href="/mod-manager">
				<div>
					<div>Download the</div>
					<div>Mod Manager</div>
				</div>
			</CtaButton>
			<LinkButton href="outer-wilds-mod://{mod.alpha ? 'alpha::' : ''}{mod.uniqueName}" isExternal>
				<div>
					<div>Install Mod</div>
					<div class="text-xs text-light opacity-50">(Mod Manager required)</div>
				</div>
			</LinkButton>
		</div>
		<div class="text-sm whitespace-nowrap flex flex-col gap-2">
			<div>
				<a class="link" href="https://github.com/{mod.author}">🧑‍🦰 {mod.author}</a>
			</div>
			<div>
				<a class="link" href={mod.repo}>📄 Source Code</a>
			</div>
			<div>
				<a class="link" href="https://github.com/{mod.author}"
					>📈 {mod.formattedDownloadCount} downloads</a
				>
			</div>
			<div>
				<a class="link" href={mod.downloadUrl}>
					🗃️ Download zip ({mod.version})
				</a>
			</div>
		</div>
	</div>
</div>
