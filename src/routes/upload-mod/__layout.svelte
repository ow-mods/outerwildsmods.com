<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { githubUserStore, octokitStore } from '$lib/store';
	import type { Octokit } from 'octokit';
	import { onDestroy, onMount } from 'svelte';

	// TODO Octokit type;
	let Octokit: any | undefined;
	let errorMessage: string;

	let githubToken = (import.meta.env['VITE_GITHUB_TOKEN'] as string) || '';
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

		try {
			const octokit = new Octokit({ auth: githubToken }) as Octokit;

			octokitStore.set(octokit);

			const authResponse = await octokit.rest.users.getAuthenticated();

			if (!authResponse.data) {
				throw new Error('Missing auth response data');
			}

			githubUserStore.set(authResponse.data);
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
		{#if $githubUserStore}
			Authenticated as
			<a class="link" href={$githubUserStore.html_url}>
				{$githubUserStore.login}
			</a>
		{:else}
			Please authenticate
		{/if}
	</p>
	<div class="flex w-full gap-4 mb-4">
		<input
			class="text-input"
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
	<slot />
</PageLayout>
