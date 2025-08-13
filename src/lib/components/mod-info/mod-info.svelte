<script lang="ts">
	import { stringToNumber } from '$lib/helpers/string-to-number';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CtaButton from '../button/cta-button.svelte';
	import DownloadIcon from '../icons/download-icon.svelte';
	import {
		commentsSectionId,
		managerInstallProtocol,
		owmlUniqueName,
	} from '$lib/helpers/constants';
	import { canInstallViaProtocol } from '$lib/helpers/can-install-via-protocol';
	import { modBeingInstalled } from '../mod-install-store';
	import ModDetails from './mod-details.svelte';

	interface Props {
		mod: Mod;
	}

	let { mod }: Props = $props();

	const singleIcons = ['🙆', '💁', '🙋', '🤷', '💆', '🤦', '🙇', '🙎', '🙅', '🧍', '🚶', '🚶‍➡️'];
	const duoIcons = ['🤼', '👯', '🧑‍🤝‍🧑', '🫂', '👥', '🧑‍🧒', '🤝'];
	const trioIcons = ['🧑‍🧑‍🧒', '🧑‍🧒‍🧒'];
	const moreIcons = ['🧑‍🧑‍🧒‍🧒'];
	const everyoneIcons = ['🌐'];

	let iconList = singleIcons;

	const author = mod.authorDisplay?.trim() || mod.author?.trim() || '';
	const authorLower = author.toLowerCase();

	const packAuthor = 'a bunch of people';
	const moreThanThreeKeywords = [
		'the',
		'team',
		'friends',
		'others',
		'group',
		'studio',
		'crew',
		'squad',
		'people',
	];

	const containsMore = moreThanThreeKeywords.some(
		(k) => authorLower.startsWith(k) || authorLower.endsWith(k)
	);

	const authorCount = authorLower
		.replace(/\s*&\s*/g, ',') // Replace " & " with comma
		.replace(/\s+and\s+/gi, ',') // Replace "and" with comma
		.replace(/\s*,\s*/g, ',') // normalize spacing around commas
		.split(',') // split the string by commas to separate into individual author names
		.map((s) => s.trim()) // remove extra spaces from each name
		.filter(Boolean).length; // remove empty strings (e.g., from double commas)

	if (authorLower === packAuthor) {
		iconList = everyoneIcons;
	} else if (authorCount > 3 || containsMore) {
		iconList = moreIcons;
	} else if (authorCount === 3) {
		iconList = trioIcons;
	} else if (authorCount === 2) {
		iconList = duoIcons;
	}

	const iconIndex = stringToNumber(author) % iconList.length;
	const modIcon = iconList[iconIndex];
</script>

<div
	class="md:bg-dark md:rounded pb-4 md:p-4 md:mb-4 relative overflow-hidden md:border-none border-b-2 border-b-darker"
>
	<div class="flex flex-col gap-4">
		<h1 class="m-0 leading-none text-2xl break-words">{mod.name}</h1>
		<div class="flex flex-wrap gap-1 text-sm">
			{#each mod.tags as tag}
				<a
					href="/mods?tag={tag}"
					class="link px-1 rounded md:bg-background bg-dark font-xs"
					data-nosnippet
				>
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
					onclick={() => modBeingInstalled.set(mod)}
				>
					Install Mod
				</CtaButton>
			{:else if mod.uniqueName === owmlUniqueName}
				<CtaButton href="/mod-manager">Get the Outer Wilds Mod Manager</CtaButton>
			{:else}
				<CtaButton href="/mod-manager#legacy-manager">Install with Legacy Mod Manager</CtaButton>
			{/if}
		</div>
		<div class="text-sm flex flex-wrap gap-x-4 gap-y-2">
			<a class="link" href="https://github.com/{mod.author}">
				{modIcon}
				{mod.authorDisplay ?? mod.author}
			</a>
			<a class="link" href={mod.repo}>📝 Source Code</a>
			<a class="link" href="/mods/{mod.slug}/downloads/">
				📈 {mod.formattedDownloadCount} downloads
			</a>
			<a class="link" href={mod.downloadUrl}>
				🗃️ Download zip ({mod.version})
			</a>
			<ModDetails {mod} />
			<a class="link" href="#{commentsSectionId}"> 💬 Comments </a>
		</div>
	</div>
</div>
