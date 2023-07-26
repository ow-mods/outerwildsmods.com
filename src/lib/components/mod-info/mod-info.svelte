<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CtaButton from '../button/cta-button.svelte';
	import DownloadIcon from '../icons/download-icon.svelte';
	import { managerInstallProtocol, owmlUniqueName, websiteUrl } from '$lib/helpers/constants';
	import CodeSnippet from '../code-snippet.svelte';
	import PopupDialog from '../popup-dialog.svelte';
	import { canInstallViaProtocol } from '$lib/helpers/can-install-via-protocol';
	import { modBeingInstalled } from '../mod-install-store';

	export let mod: Mod;

	const singleIcons = ['🙆', '💁', '🙋', '🤷', '💆', '🤦', '🙇', '🙎', '🙅'];
	const duoIcons = ['🤼', '👯', '🧑‍🤝‍🧑', '🫂', '👥'];
	const trioIcons = ['👪', '👨‍👦‍👦'];
	const moreIcons = ['👨‍👨‍👦‍👦'];

	let iconList = singleIcons;

	if (mod.authorDisplay) {
		const authorCount = mod.authorDisplay.split(/&| and |,/).length;

		if (authorCount > 3) {
			iconList = moreIcons;
		} else if (authorCount > 2) {
			iconList = trioIcons;
		} else if (authorCount > 1) {
			iconList = duoIcons;
		}
	}

	const author = mod.authorDisplay ?? mod.author;

	const iconIndex = stringToNumber(author) % iconList.length;
	const modIcon = iconList[iconIndex];

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

<div class="bg-dark rounded p-4 mb-4 relative overflow-hidden">
	<div class="flex flex-col gap-4">
		<h1 class="m-0 leading-none text-2xl break-words">{mod.name}</h1>
		<div class="flex flex-wrap gap-1 text-sm">
			{#each mod.tags as tag}
				<a href="/mods?tag={tag}" class="link px-1 rounded bg-background font-xs" data-nosnippet>
					{tag}
				</a>
			{/each}
		</div>
		<p class="m-0 break-words text-sm">{mod.description}</p>
		<div class="flex flex-col gap-4">
			{#if canInstallViaProtocol(mod)}
				<CtaButton
					icon={DownloadIcon}
					href="{managerInstallProtocol}/{mod.uniqueName}"
					on:click={() => modBeingInstalled.set(mod)}
				>
					Install Mod
				</CtaButton>
			{:else if mod.uniqueName === owmlUniqueName}
				<CtaButton href="/mod-manager">Get the Outer Wilds Mod Manager</CtaButton>
			{:else}
				<CtaButton href="/mod-manager#legacy-manager">Install with Legacy Mod Manager</CtaButton>
			{/if}
		</div>
		<div class="text-sm flex flex-col gap-2">
			<div>
				<a class="link break-words flex gap-1 items-center" href="https://github.com/{mod.author}">
					<span class="text-xl -mx-1">{modIcon}</span>
					<span>{mod.authorDisplay ?? mod.author}</span>
				</a>
			</div>
			<div>
				<a class="link" href={mod.repo}>📄 Source Code</a>
			</div>
			<div>
				<a class="link" href="/mods/{mod.slug}/downloads/">
					📈 {mod.formattedDownloadCount} downloads
				</a>
			</div>
			<div>
				<a class="link" href={mod.downloadUrl}>
					🗃️ Download zip ({mod.version})
				</a>
			</div>
		</div>
		<button class="link text-sm" on:click={openDialog} on:keydown={openDialog}>More Info...</button>
	</div>
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
						from this website. This is what it looks like:
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
	</PopupDialog>
{/if}
