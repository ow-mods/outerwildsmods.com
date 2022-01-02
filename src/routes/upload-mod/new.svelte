<script lang="ts">
	import { goto } from '$app/navigation';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { githubUserStore, octokitStore } from '$lib/store';

	let modName = '';

	const handleClickCreate = async () => {
		console.log('haha');
		console.log('modName', modName);
		if (!modName || !$octokitStore) return;
		const repoName = getModPathName(modName);
		if (!repoName) return;

		const repo = (
			await $octokitStore.rest.repos.createUsingTemplate({
				template_owner: 'xen-42',
				template_repo: 'ow-new-horizons-config-template',
				name: repoName,
				private: true,
			})
		).data;

		await $octokitStore.rest.repos.replaceAllTopics({
			repo: repoName,
			owner: repo.owner.login,
			names: ['outer-wilds'],
		});

		goto(`upload-mod/${repo.full_name}`);
	};
</script>

{#if $githubUserStore}
	<div class="flex gap-4">
		<input class="flex-1 rounded bg-dark py-1 px-2" placeholder="Mod name" bind:value={modName} />
		<LinkButton on:click={handleClickCreate}>Create</LinkButton>
	</div>
{:else}
	Please authenticate before creating a new mod
{/if}
