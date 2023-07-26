<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CtaButton from '../button/cta-button.svelte';
	import { managerInstallProtocol, websiteUrl } from '$lib/helpers/constants';
	import LinkButton from '../button/link-button.svelte';
	import { focusElement } from '$lib/helpers/focus-element';
	import PageSection from '../page-section/page-section.svelte';
	import CodeSnippet from '../code-snippet.svelte';

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

	const badgeJsonUrl = `${websiteUrl}/api/${mod.uniqueName}/badge.json`;
	const badgeImageUrl = `https://img.shields.io/endpoint?url=${encodeURIComponent(badgeJsonUrl)}`;
	const badgeMarkdown = `[![Install ${mod.uniqueName}](${badgeImageUrl})](${websiteUrl}/mods/${mod.slug}/)`;

	let isMoreInfoOpen = true;
	const closeDialog = () => {
		isMoreInfoOpen = false;
	};
	const openDialog = () => {
		isMoreInfoOpen = true;
	};
</script>

{#if isMoreInfoOpen}
	<div
		on:click={closeDialog}
		on:keydown={closeDialog}
		class="bg-black bg-opacity-50 w-full h-full z-50 top-0 left-0 fixed flex items-center justify-center"
	>
		<div
			class="m-4 p-4 rounded bg-background flex flex-col gap-4 transition-transform will-change-transform max-w-md max-h-full overflow-auto"
			on:click|stopPropagation
			on:keydown|stopPropagation
			use:focusElement
			aria-modal
			tabindex="-1"
		>
			<div>
				<h3 class="m-0">Mod Unique Name</h3>
				<p>This is the name that uniquely identifies this mod.</p>
				<CodeSnippet>
					{mod.uniqueName}
				</CodeSnippet>
			</div>
			<!-- New manager doesn't support alpha so don't give the option for a badge since it won't work -->
			{#if !mod.alpha}
				<div>
					<h3 class="m-0">Mod Badge</h3>
					<p>
						You can use Shields.io to display a badge for this mod using a JSON endpoint we serve
						from this website. This is what it looks like:
					</p>
					<img alt="Badge for {mod.name}" src={badgeImageUrl} />
					<p>JSON url</p>
					<CodeSnippet>
						{badgeJsonUrl}
					</CodeSnippet>
					<p>Markdown</p>
					<CodeSnippet>
						{badgeMarkdown}
					</CodeSnippet>
				</div>
			{/if}
			<LinkButton on:click={closeDialog}>OK</LinkButton>
		</div>
	</div>
{/if}

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
			<!-- The new manager doesn't support Alpha mods yet, so we point to the old manager. -->
			{#if mod.alpha}
				<CtaButton href="/mod-manager#legacy-manager">
					<div>
						<div>Install mod using</div>
						<div>Mod Manager</div>
					</div>
				</CtaButton>
			{:else}
				<CtaButton href="{managerInstallProtocol}/{mod.uniqueName}">Install Mod</CtaButton>
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
