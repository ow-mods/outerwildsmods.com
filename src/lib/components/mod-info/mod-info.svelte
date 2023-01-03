<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import CtaButton from '../button/cta-button.svelte';
	import TagToggle from '../tag-toggle.svelte';

	export let mod: ModsRequestItem;
</script>

<div class="bg-dark rounded p-4 mb-4 relative overflow-hidden">
	<div class="flex flex-col gap-4">
		<h1 class="m-0 leading-none text-2xl break-words">{mod.name}</h1>
		<div class="flex flex-wrap gap-1 text-sm">
			{#each mod.tags as tag}
				<span class="px-1 rounded bg-background font-normal" data-nosnippet>{tag}</span>
			{/each}
		</div>
		<p class="m-0 break-words text-sm">{mod.description}</p>
		<div class="flex flex-col gap-4">
			<CtaButton href="/mod-manager">
				<div>
					<div>Install mod using</div>
					<div>Mod Manager</div>
				</div>
			</CtaButton>
			<!-- TODO: this install button is still acting a bit weird so I'm disabling it for now -->
			<!-- <LinkButton href="outer-wilds-mod://{mod.alpha ? 'alpha::' : ''}{mod.uniqueName}" isExternal>
				<div>
					<div>Install Mod</div>
					<div class="text-xs text-light opacity-50">(Mod Manager required)</div>
				</div>
			</LinkButton> -->
		</div>
		<div class="text-sm flex flex-col gap-2">
			<div>
				<a class="link break-words flex gap-1 items-center" href="https://github.com/{mod.author}">
					<span>🙋</span>
					<span>{mod.authorDisplay ?? mod.author}</span>
				</a>
			</div>
			<div>
				<a class="link" href={mod.repo}>📄 Source Code</a>
			</div>
			<div>
				<a class="link" href="/mods/{mod.slug}/downloads/"
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
