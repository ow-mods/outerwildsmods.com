<script lang="ts">
	import type { OctokitRepoArray } from '$lib/octokit';
	import { octokitStore } from '$lib/store';

	let errorMessage: string;
	let modRepos: OctokitRepoArray = [];

	$: (async () => {
		console.log('hello');
		if (!$octokitStore) return;

		try {
			const repos = await $octokitStore.paginate(
				$octokitStore.rest.repos.listForAuthenticatedUser,
				{
					per_page: 100,
				}
			);

			modRepos = repos.filter((repo) => repo.topics?.includes('outer-wilds'));
		} catch (error) {
			errorMessage = `Error fetching repo list: ${error}`;
		}
	})();
</script>

{#if modRepos.length > 0}
	<h2>Select a repo</h2>
	<div class="flex flex-col gap-2">
		{#each modRepos as repo (repo.id)}
			<button class="link button bg-dark rounded p-2">
				{repo.name}
			</button>
		{/each}
	</div>
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
