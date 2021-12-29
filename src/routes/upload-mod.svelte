<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import type { Octokit, OctokitAuthenticatedUser, OctokitRepoArray } from '$lib/octokit';

	import { onDestroy, onMount } from 'svelte';
	import A4 from './404.svelte';

	let Octokit: Octokit | undefined;
	let user: OctokitAuthenticatedUser;
	let errorMessage: string;
	let modRepos: OctokitRepoArray = [];

	let githubToken = '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';
	let interval: NodeJS.Timer;

	onMount(() => {
		interval = setInterval(() => {
			console.log('checking...');
			// @ts-ignore
			Octokit = window.Octokit as Octokit;
			if (!Octokit) return;

			console.log('done');
			clearInterval(interval);
		}, 200);
	});

	onDestroy(() => {
		if (interval) {
			console.log('destroy');
			clearInterval(interval);
		}
	});

	const handleClickAuthenticate = async () => {
		if (!Octokit) return;

		const octokit = new Octokit({ auth: githubToken });

		try {
			user = (await octokit.rest.users.getAuthenticated()).data;

			const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
				per_page: 100,
			});

			// TODO deal with the type.
			modRepos = repos.filter((repo) => repo.topics?.includes('outer-wilds'));

			console.log('repos', JSON.stringify(modRepos));

			// modRepos = repos.filter(repo => repo.template_repository.)

			// const a = await octokit.rest.repos.createUsingTemplate({
			// 	template_owner: 'Raicuparta',
			// 	template_repo: 'ow-mod-template',
			// 	name: 'ow-new-mod-test',
			// 	private: true,
			// });
		} catch (error) {
			errorMessage = `Error authenticating: ${error}`;
		}
	};
</script>

<svelte:head>
	<script type="module">
		import { Octokit } from 'https://cdn.skypack.dev/octokit';

		window.Octokit = Octokit;
	</script>
</svelte:head>

<PageLayout>
	<p>
		{#if user}
			Authenticated as
			<a class="link" href={user.html_url}>
				{user.login}
			</a>
		{:else}
			Please authenticate
		{/if}
	</p>
	<div class="flex w-full gap-4">
		<input
			class="flex-1 rounded bg-dark py-1 px-2 block"
			placeholder="Insert GitHub access token here"
			bind:value={githubToken}
		/>
		<button class="button link bg-dark" on:click={handleClickAuthenticate}> Authenticate </button>
	</div>
	{#if errorMessage}
		<p>
			{errorMessage}
		</p>
	{/if}
	{#if modRepos.length > 0}
		<h2>Select a repo</h2>
		<div class="flex flex-col gap-2">
			{#each modRepos as repo (repo.id)}
				<div class="bg-dark rounded p-2">
					{repo.name}
				</div>
			{/each}
		</div>
	{/if}
</PageLayout>
