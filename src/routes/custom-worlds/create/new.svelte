<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import TextInput from '$lib/components/mod-editor/text-input.svelte';
	import { getModPathName } from '$lib/helpers/mod-path-name';
	import type { OctokitCreatedRepo } from '$lib/octokit';
	import { githubUser, octokit } from '$lib/store';

	let modName = '';
	let loading = false;
	let createdRepo: OctokitCreatedRepo | undefined = undefined;

	const handleClickCreate = async () => {
		if (!modName || !$octokit) return;
		try {
			loading = true;

			const repoName = getModPathName(modName);
			if (!repoName) return;

			createdRepo = (
				await $octokit.rest.repos.createUsingTemplate({
					template_owner: 'xen-42',
					template_repo: 'ow-new-horizons-config-template',
					name: repoName,
					private: false,
				})
			).data;

			await $octokit.rest.repos.replaceAllTopics({
				repo: repoName,
				owner: createdRepo.owner.login,
				names: ['outer-wilds', 'outer-wilds-planets'],
			});

			// Typed as any because the types for this are useless.
			const manifestResponse: any = (
				await $octokit.rest.repos.getContent({
					repo: repoName,
					owner: createdRepo.owner.login,
					path: 'manifest.json',
				})
			).data;

			const manifest = JSON.parse(atob(manifestResponse.content));

			await $octokit.rest.repos.createOrUpdateFileContents({
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
							version: '0.0.0',
						},
						null,
						2
					)
				),
				message: 'Update manifest.json',
			});

			// Typed as any because the types for this are useless.
			const readmeResponse: any = (
				await $octokit.rest.repos.getContent({
					repo: repoName,
					owner: createdRepo.owner.login,
					path: 'README.md',
				})
			).data;

			await $octokit.rest.repos.createOrUpdateFileContents({
				repo: repoName,
				owner: createdRepo.owner.login,
				path: readmeResponse.path,
				sha: readmeResponse.sha,
				content: btoa(`# ${modName}`),
				message: 'Update Readme.md',
			});
		} catch (error) {
			// TODO handle errors
			console.error('Error creating mod', error);
		} finally {
			loading = false;
		}
	};
</script>

{#if $githubUser}
	<div>
		This will create a new repository on GitHub based on
		<a
			class="link"
			href="https://github.com/xen-42/ow-new-horizons-config-template"
			target="_blank"
			rel="noopener noreferrer"
		>
			planet creation template
		</a>.
	</div>
	<TextInput
		label="Mod name"
		id="mod-name"
		placeholder="e.g. 'Real Solar System'"
		bind:value={modName}
		on:submit={handleClickCreate}
		buttonText="Create"
		disabled={Boolean(createdRepo)}
	/>
{:else}
	Please authenticate before creating a new mod
{/if}
{#if createdRepo}
	<div class="mt-4">
		<p>
			A repository has been created: <a
				class="link"
				target="_blank"
				rel="noopener noreferrer"
				href={createdRepo?.html_url}
			>
				{createdRepo?.full_name}
			</a>.
		</p>
		<p>
			Download your addon's files, and extract the folder the mods directory in your system. Find
			the mods directory by pressing the "Mods Direcory" button in the
			<a href="/mod-manager" target="_blank" class="link"> Mod Manager </a>.
		</p>
		<CtaButton
			href="https://github.com/{createdRepo?.full_name}/archive/refs/heads/{createdRepo?.default_branch}.zip"
		>
			Download addon files
		</CtaButton>
		<p>
			After you're done installing your addon, you can start creating your worlds. Read the
			instructions on how to create worlds in the <a
				class="link"
				target="_blank"
				href="/mods/newhorizons"
			>
				New Horizons readme
			</a>.
		</p>
		<p>
			Once you've edited your addon to your desire, you can come back to this page to upload your
			files.
		</p>
		<LinkButton
			href="/custom-worlds/create/edit?{new URLSearchParams({
				owner: createdRepo.owner.login,
				repo: createdRepo.name,
			})}">Upload addon files</LinkButton
		>
	</div>
{/if}
{#if loading}
	<div>Please wait...</div>
{/if}
