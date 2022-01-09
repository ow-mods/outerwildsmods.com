<script lang="ts">
	import SubmitButton from './submit-button.svelte';
	import ModCardDetails from '../card-grid/mod-card-details.svelte';
	import ModDescriptionEditor from './mod-description-editor.svelte';
	import ModThumbnailEditor from './mod-thumbnail-editor.svelte';
	import { octokit } from '$lib/store';
	import type { OctokitRepo } from '$lib/octokit';
	import { onMount } from 'svelte';
	import { getManifest, Manifest } from '$lib/helpers/get-manifest';
	import { getRepoData } from '$lib/helpers/get-repo-data';

	export let owner: string;
	export let repo: string;

	let repoData: OctokitRepo | undefined;
	let description = '';
	let manifest: Manifest | undefined;
	let savingDescription = false;

	onMount(async () => {
		repoData = await getRepoData(owner, repo);
		manifest = await getManifest(owner, repo);
	});

	const saveDescription = async () => {
		if (!$octokit) return;
		savingDescription = true;

		try {
			await $octokit.rest.repos.update({
				owner,
				repo,
				description,
			});

			repoData = await getRepoData(owner, repo);
		} catch (error) {
			// TODO handle errors.
			console.error(`Error saving description: ${error}`);
		} finally {
			savingDescription = false;
		}

		description = '';
	};
</script>

<div class="flex flex-col gap-4" style="min-width: 300px;">
	<div
		class="max-w-sm mx-auto bg-dark w-full h-full rounded hover:bg-background outline-4 outline-dark hover:outline overflow-hidden"
	>
		<ModThumbnailEditor {owner} {repo} />
		<ModCardDetails mod={{ name: manifest?.name || '...' }}>
			<ModDescriptionEditor
				placeholder={repoData?.description || 'Type your addon description here.'}
				bind:value={description}
			/>
		</ModCardDetails>
	</div>
	<SubmitButton disabled={savingDescription || description.length === 0} on:click={saveDescription}>
		{#if savingDescription}
			Saving...
		{:else}
			Save description
		{/if}
	</SubmitButton>
</div>
