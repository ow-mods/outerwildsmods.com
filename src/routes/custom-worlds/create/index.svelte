<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import type { OctokitRepoArray } from '$lib/octokit';
	import { githubUser, octokit } from '$lib/store';

	let errorMessage: string;
	let repos: OctokitRepoArray = [];
	let processedRepos: OctokitRepoArray = [];
	let loadingRepos = false;
	let shouldFilterByTopic = true;

	$: (async () => {
		if (!$octokit || !$githubUser) {
			repos = [];
			return;
		}

		try {
			loadingRepos = true;
			repos = await $octokit.paginate($octokit.rest.repos.listForAuthenticatedUser, {
				per_page: 100,
			});
		} catch (error) {
			errorMessage = `Error fetching repo list: ${error}`;
		} finally {
			loadingRepos = false;
		}
	})();

	$: {
		processedRepos = repos
			.filter(
				(repo) =>
					(!shouldFilterByTopic || repo.topics?.includes('outer-wilds-planets')) &&
					!repo.disabled &&
					repo.owner.login === $githubUser?.login
			)
			.sort(
				(repoA, repoB) =>
					new Date(repoB.updated_at || repoB.created_at || 0).valueOf() -
					new Date(repoA.updated_at || repoA.created_at || 0).valueOf()
			);
	}
</script>

{#if $githubUser}
	<p class="text-xl mt-0">Start with a new addon</p>
	<CtaButton href="/custom-worlds/create/new">Create new addon</CtaButton>
	<div class="flex justify-between items-center">
		<p class="text-xl">Select an addon to edit</p>
		<label class="text-sm" for="planet-mods-filter-checkbox">
			Filter by <code>outer-wilds-planets</code> topic
			<input bind:checked={shouldFilterByTopic} id="planet-mods-filter-checkbox" type="checkbox" />
		</label>
	</div>
	{#if loadingRepos}
		<div class="outline outline-4 outline-dark rounded p-2 text-center">Loading mod list...</div>
	{:else if processedRepos.length === 0}
		<div class="outline outline-4 outline-dark rounded p-2 text-center">No planet mods found.</div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each processedRepos as repo (repo.id)}
				<LinkButton href="/custom-worlds/create/{repo.owner.login}/{repo.name}">
					{repo.name}
				</LinkButton>
			{/each}
		</div>
	{/if}
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
