<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import type { Octokit } from '$lib/octokit';

	import { onDestroy, onMount } from 'svelte';

	let Octokit: Octokit | undefined;

	let githubToken = '';
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

	const handleClickAuthenticate = () => {
		if (!Octokit) return;

		const octokit = new Octokit({ auth: githubToken });
		console.log('octokit', octokit);
	};
</script>

<svelte:head>
	<script type="module">
		import { Octokit } from 'https://cdn.skypack.dev/octokit';

		window.Octokit = Octokit;
	</script>
</svelte:head>

<PageLayout>
	<div class="flex w-full gap-4">
		<input
			class="flex-1 rounded bg-dark py-1 px-2 block"
			placeholder="Insert GitHub access token here"
			bind:value={githubToken}
		/>
		<button class="button link bg-dark" on:click={handleClickAuthenticate}> Authenticate </button>
	</div>
</PageLayout>
