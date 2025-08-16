<script lang="ts">
	import { sortBy } from 'lodash-es';

	interface Props {
		people: Record<string, string>;
		title: string;
	}

	let { people, title }: Props = $props();

	const peopleList = sortBy(Object.entries(people), ([displayName]) => displayName.toUpperCase());
	const avatarSize = 40;
</script>

<div class="flex flex-col gap-4">
	<h3 class="mt-0 mb-2 text-center">{title}</h3>
	{#each peopleList as [displayName, id]}
		<a
			class="link flex gap-2 items-center"
			href={id.length === 0 || id.startsWith('http') ? id : `https://github.com/${id}`}
		>
			<img
				alt={displayName}
				src={id.length === 0 || id.startsWith('http')
					? '/images/placeholder.webp'
					: `https://github.com/${id}.png?size=${avatarSize}`}
				width={avatarSize}
				height={avatarSize}
				class="rounded-full outline-3 outline outline-darker"
			/>
			{displayName}
		</a>
	{/each}
</div>
