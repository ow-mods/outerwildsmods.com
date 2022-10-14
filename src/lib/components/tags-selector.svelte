<script lang="ts">
	import { tagsState } from '$lib/store';

	const onClickTag = (tag: string) => {
		tagsState.set({
			...$tagsState,
			[tag]: !$tagsState[tag],
		});
	};

	const setAll = (state: boolean) => {
		const tags = { ...$tagsState };
		for (const tag of Object.keys(tags)) {
			tags[tag] = state;
		}

		tagsState.set(tags);
	};
</script>

<div class="flex gap-2 mb-2">
	{#each Object.entries($tagsState) as [tag, selected]}
		<button
			class="px-1 rounded bg-dark text-sm border-dark border outline outline-background hover:bg-background hover:outline-dark outline-2"
			class:outline-accent={selected}
			on:click={() => onClickTag(tag)}>{tag}</button
		>
	{/each}
	<button
		class="px-1 rounded bg-dark text-sm border-dark border outline outline-background hover:bg-background hover:outline-dark outline-2"
		on:click={() => setAll(false)}
		title="None"
	>
		none
	</button>

	<button
		class="px-1 rounded bg-dark text-sm border-dark border outline outline-background hover:bg-background hover:outline-dark outline-2"
		on:click={() => setAll(true)}
		title="All"
	>
		all
	</button>
</div>
