<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CtaButton from '../button/cta-button.svelte';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import DownloadIcon from '../icons/download-icon.svelte';

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
	const uniqueNameParts = mod.uniqueName.split('.');

	const selectElementText = ({ currentTarget }: { currentTarget: HTMLElement }) => {
		window.getSelection()?.selectAllChildren(currentTarget);
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
			<div>
				<a class="link" href={`/api/${mod.uniqueName}/badge.json`}>Raw Install Badge</a>
			</div>
			<div>
				<code
					on:click={selectElementText}
					on:keypress={selectElementText}
					title="Mod unique name"
					class="text-xs text-light opacity-60 bg-darker p-1 rounded leading-none cursor-pointer break-words block text-center"
				>
					{#each uniqueNameParts as uniqueNamePart, index}
						<div>{uniqueNamePart}{index < uniqueNameParts.length - 1 ? '.' : ''}</div>
					{/each}
				</code>
			</div>
		</div>
	</div>
</div>
