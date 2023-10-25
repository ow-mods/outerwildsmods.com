<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { websiteUrl } from '$lib/helpers/constants';
	import CodeSnippet from '../code-snippet.svelte';
	import PopupDialog from '../popup-dialog.svelte';
	import { canInstallViaProtocol } from '$lib/helpers/can-install-via-protocol';

	export let mod: Mod;

	const modUrl = `${websiteUrl}/mods/${mod.slug}/`;
	const badgeJsonUrl = `${websiteUrl}/api/${mod.uniqueName}/badge.json`;
	const badgeImageUrl = `https://img.shields.io/endpoint?url=${encodeURIComponent(badgeJsonUrl)}`;
	const badgeMarkdown = `[![Install ${mod.name}](${badgeImageUrl})](${modUrl})`;
	const badgeHtml = `<a href="${modUrl}"><img alt="Install ${mod.name}" src="${badgeImageUrl}" /></a>`;

	let isMoreInfoOpen = false;
	const closeDialog = () => {
		isMoreInfoOpen = false;
	};
	const openDialog = () => {
		isMoreInfoOpen = true;
	};
</script>

<div>
	<button class="link text-sm" on:click={openDialog} on:keydown={openDialog}> ℹ️ Details </button>
</div>

{#if isMoreInfoOpen}
	<PopupDialog isOpen={isMoreInfoOpen} onClose={closeDialog}>
		<div>
			<h3 class="m-0">Mod Unique Name</h3>
			<span>This is the name that uniquely identifies this mod.</span>
			<CodeSnippet>
				{mod.uniqueName}
			</CodeSnippet>
		</div>
		{#if canInstallViaProtocol(mod)}
			<div>
				<h3 class="m-0">Mod Badge</h3>
				<div class="flex flex-col gap-4">
					<span>
						You can use Shields.io to display a badge for this mod using a JSON endpoint we serve
						from this website. You can customize the look of the badge using query parameters, as
						explained in the <a href="https://shields.io/badges" class="link">Shields.io docs</a>.
					</span>
					<img alt="Badge for {mod.name}" src={badgeImageUrl} />
					<CodeSnippet title="Markdown">
						{badgeMarkdown}
					</CodeSnippet>
					<CodeSnippet title="HTML">
						{badgeHtml}
					</CodeSnippet>
					<CodeSnippet title="Image url">
						{badgeImageUrl}
					</CodeSnippet>
					<CodeSnippet title="JSON url">
						{badgeJsonUrl}
					</CodeSnippet>
				</div>
			</div>
		{/if}
		<div>
			<h3 class="m-0">Mod Data</h3>
			<span>
				This is the JSON data extracted from the mod database. It is used to generate this mod's
				page, to get the latest version, etc.
			</span>
			<div class="flex flex-col gap-4">
				<CodeSnippet>{JSON.stringify(mod, null, 2)}</CodeSnippet>
			</div>
		</div>
	</PopupDialog>
{/if}
