<script lang="ts">
	import { goto } from '$app/navigation';
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import type { OctokitCreatedRepo } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';

	let modName = '';
	let loading = false;
	let createdRepo: OctokitCreatedRepo | undefined = undefined;

	const handleClickCreate = async () => {
		if (!modName || !$octokitStore) return;
		try {
			loading = true;

			const repoName = getModPathName(modName);
			if (!repoName) return;

			createdRepo = (
				await $octokitStore.rest.repos.createUsingTemplate({
					template_owner: 'xen-42',
					template_repo: 'ow-new-horizons-config-template',
					name: repoName,
					private: true,
				})
			).data;

			await $octokitStore.rest.repos.replaceAllTopics({
				repo: repoName,
				owner: createdRepo.owner.login,
				names: ['outer-wilds', 'outer-wilds-planets'],
			});

			// Typed as any because the types for this are useless.
			const manifestResponse: any = (
				await $octokitStore.rest.repos.getContent({
					repo: repoName,
					owner: createdRepo.owner.login,
					path: 'manifest.json',
				})
			).data;

			const manifest = JSON.parse(atob(manifestResponse.content));

			await $octokitStore.rest.repos.createOrUpdateFileContents({
				repo: repoName,
				owner: createdRepo.owner.login,
				path: manifestResponse.path,
				sha: manifestResponse.sha,
				content: btoa(
					JSON.stringify(
						{
							...manifest,
							author: createdRepo.owner.login,
							name: modName,
							uniqueName: `${createdRepo.owner.login}.${repoName}`,
							version: '0.1.0',
						},
						null,
						2
					)
				),
				message: 'Update manifest.json',
			});

			downloadHref = `https://github.com/${createdRepo.full_name}/archive/refs/heads/${createdRepo.default_branch}.zip`;
			continueHref = `/custom-worlds/create/${createdRepo.full_name}`;
		} catch (error) {
			// TODO handle errors
			console.error('Error creating mod', error);
		} finally {
			loading = false;
		}
	};
</script>

{#if $githubUserStore}
	<div>
		This will create a new repository on GitHub based on <a
			class="link"
			href="https://github.com/xen-42/ow-new-horizons-config-template">planet creation template</a
		>.
	</div>
	<TextInput
		label="Mod name"
		id="mod-name"
		placeholder="My Mod"
		bind:value={modName}
		on:submit={handleClickCreate}
		buttonText="Create"
	/>
{:else}
	Please authenticate before creating a new mod
{/if}
{#if createdRepo}
	<div class="mt-4 flex flex-col gap-4">
		<p class="m-0">Hello</p>
		<CtaButton
			href="https://github.com/{createdRepo?.full_name}/archive/refs/heads/{createdRepo?.default_branch}.zip"
			>Download addon files</CtaButton
		>
		<LinkButton href="/custom-worlds/create/{createdRepo?.full_name}">Continue</LinkButton>
	</div>
{/if}
{#if loading}
	<div>Please wait...</div>
{/if}
