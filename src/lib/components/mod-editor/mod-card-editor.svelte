<script lang="ts">
	import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';
	import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
	import { listedImageSize } from '$lib/helpers/constants';
	import SubmitButton from './submit-button.svelte';
	import ModCardImage from '$lib/components/card-grid/mod-card-image.svelte';
	import ModCardDetails from '../card-grid/mod-card-details.svelte';
	import ModDescriptionEditor from './mod-description-editor.svelte';
	import ModThumbnailEditor from './mod-thumbnail-editor.svelte';
	import { octokit } from '$lib/store';
	import type { RepoParameters } from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';
	import type { OctokitRepo } from '$lib/octokit';
	import { onMount } from 'svelte';

	export let repoParameters: RepoParameters;
	export let name: string;
	export let savingDescription = false;

	let repo: OctokitRepo | undefined;
	let mod = {
		formattedDownloadCount: '100',
		imageUrl: '',
		name,
	};
	let description = '';

	onMount(() => {
		getRepo();
	});

	const getRepo = async () => {
		if (!$octokit) return;

		repo = (await $octokit.rest.repos.get(repoParameters)).data;
	};

	const saveDescription = async () => {
		if (!$octokit) return;
		savingDescription = true;

		try {
			await $octokit.rest.repos.update({
				...repoParameters,
				description,
			});

			await getRepo();
		} catch (error) {
			// TODO handle errors.
			console.error(`Error saving description: ${error}`);
		} finally {
			savingDescription = false;
		}

		description = '';
	};
</script>

<div class="flex gap-4 justify-center items-end relative">
	<div style="width: 300px;">
		<div
			class="max-w-sm mx-auto bg-dark w-full h-full rounded hover:bg-background outline-4 outline-dark hover:outline overflow-hidden"
		>
			<ModThumbnailEditor {repoParameters} />
			<ModCardDetails {mod}>
				<ModDescriptionEditor
					placeholder={repo?.description || 'Type your addon description here.'}
					bind:value={description}
				/>
			</ModCardDetails>
		</div>
	</div>
	<div class:invisible={description.length === 0}>
		<SubmitButton disabled={savingDescription} on:click={saveDescription}>
			{#if savingDescription}
				Saving...
			{:else}
				Save
			{/if}
		</SubmitButton>
	</div>
</div>
