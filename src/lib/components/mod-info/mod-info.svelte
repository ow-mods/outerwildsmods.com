<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import CtaButton from '../button/cta-button.svelte';

	export let mod: ModsRequestItem;

	const singleIcons = ['🙆', '💁', '🙋', '🤷', '💆', '🤦', '🙇', '🙎', '🙅'];
	const duoIcons = ['🤼', '👯', '🧑‍🤝‍🧑', '🫂', '👥'];
	const trioIcons = ['👪', '👨‍👦‍👦'];
	const moreIcons = ['👨‍👨‍👦‍👦'];

	let iconList = singleIcons;
	let clickedInstall = false;

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

	const installLink =
		mod.alpha ?? false ? '/mod-manager#legacy-man' : `owmods://install-mod/${mod.uniqueName}`;

	const iconIndex = stringToNumber(author) % iconList.length;
	const modIcon = iconList[iconIndex];

	const selectElementText = (node: Node) => {
		window.getSelection()?.selectAllChildren(node);
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
				<CtaButton href="/mod-manager#legacy-man">
					<div>
						<div>Install mod using</div>
						<div>Mod Manager</div>
					</div>
				</CtaButton>
			{:else}
				<CtaButton
					href="owmods://install-mod/{mod.uniqueName}"
					on:click={() => {
						clickedInstall = true;
					}}
				>
					Install Mod
				</CtaButton>
			{/if}
			{#if clickedInstall}
				<div class="text-xs bg-background rounded p-2 flex flex-col gap-2">
					<div>Installing...</div>
					<div>
						If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and try
						again.
					</div>
				</div>
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
				<code
					on:click={(event) => {
						selectElementText(event.currentTarget);
					}}
					on:keypress={(event) => {
						selectElementText(event.currentTarget);
					}}
					class="text-xs text-light opacity-60 bg-darker p-1 rounded leading-none cursor-pointer"
				>
					{mod.uniqueName}
				</code>
			</div>
		</div>
	</div>
</div>
