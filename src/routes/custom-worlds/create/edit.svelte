<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ModCardEditor from '$lib/components/mod-editor/mod-card-editor.svelte';
	import ModFileUploader from '$lib/components/mod-editor/mod-file-uploader.svelte';
	import { githubUser } from '$lib/store';
	import { getRepoData } from '$lib/helpers/get-repo-data';
	import ModPublishButton from '$lib/components/mod-editor/mod-publish-button.svelte';

	const owner = $page.url.searchParams.get('owner');
	const repo = $page.url.searchParams.get('repo');

	onMount(async () => {
		const shouldRedirect = async () => {
			if (!owner || !repo) {
				return true;
			}

			if (!$githubUser) {
				return false;
			}

			try {
				const repoData = await getRepoData(owner, repo);
				if (!repoData || !repoData.permissions?.push) {
					return true;
				}
			} catch {
				return true;
			}
			return false;
		};

		if (await shouldRedirect()) {
			goto('/custom-worlds/create');
		}
	});
</script>

{#if $githubUser && owner && repo}
	<div class="flex gap-4">
		<div>
			<ModCardEditor {owner} {repo} />
		</div>
		<ModFileUploader {owner} {repo} />
	</div>
	<ul class="text-sm pl-4 flex flex-col gap-2 mt-8 mb-0">
		<li>
			The GitHub repository for your addon is <a
				class="link"
				href="https://github.com/{owner}/{repo}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{owner}/{repo}
			</a>
		</li>
		<li>
			Learn how to edit your addon by reading the
			<a class="link" target="_blank" href="/mods/newhorizons">New Horizons readme</a>.
		</li>
		<li>
			This tool is meant to edit addons created here, or any addon based on the
			<a
				class="link"
				href="https://github.com/xen-42/ow-new-horizons-config-template"
				target="_blank"
				rel="noopener noreferrer"
			>
				planet creation template
			</a>. If you try to use it with other GitHub repositories, you might break stuff.
		</li>
	</ul>
	<ModPublishButton {owner} {repo} />
{:else}
	<p>
		Please authenticate with an access token that has access to {owner}/{repo}
	</p>
{/if}
