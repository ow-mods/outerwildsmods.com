<script lang="ts">
	import { goto } from '$app/navigation';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import TextInput from '$lib/components/text-input.svelte';
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

		// Typed as any because the types for this are useless.
		const manifest: any = (
			await $octokitStore.rest.repos.getContent({
				repo: repoName,
				owner: repo.owner.login,
				path: 'manifest.json',
			})
		).data;

		await $octokitStore.rest.repos.createOrUpdateFileContents({
			repo: repoName,
			owner: repo.owner.login,
			path: manifest.path,
			sha: manifest.sha,
			content: btoa(
				JSON.stringify(
					{
						// TODO don't hardcode all this, just base it on the template.
						filename: 'NewHorizonsConfig.dll',
						author: repo.owner.login,
						name: modName,
						uniqueName: `${repo.owner.login}.${repoName}`,
						version: '0.1.0',
						owmlVersion: '2.1.0',
						dependencies: ['xen.NewHorizons'],
					},
					null,
					2
				)
			),
			message: 'Update manifest.json',
		});

		goto(`upload-mod/${repo.full_name}`);
	};
</script>

{#if $githubUserStore}
	<TextInput
		label="Mod name"
		id="mod-name"
		placeholder="My Mod"
		bind:value={modName}
		on:click={handleClickCreate}
		buttonText="Create"
	/>
{:else}
	Please authenticate before creating a new mod
{/if}
