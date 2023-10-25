<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CtaButton from '../button/cta-button.svelte';
	import DownloadIcon from '../icons/download-icon.svelte';
	import { managerInstallProtocol, owmlUniqueName, websiteUrl } from '$lib/helpers/constants';
	import { canInstallViaProtocol } from '$lib/helpers/can-install-via-protocol';
	import { modBeingInstalled } from '../mod-install-store';
	import ModMoreInfo from './mod-more-info.svelte';

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
			<div>
				<a class="link" href="#mod-comments"> 💬 Comments </a>
			</div>
		</div>
		<ModMoreInfo {mod} />
	</div>
</div>
