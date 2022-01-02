<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import TextInput from '$lib/components/text-input.svelte';
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

<PageLayout isWide>
	<p>
		{#if $githubUserStore}
			Authenticated as
			<a class="link" href={$githubUserStore.html_url}>
				{$githubUserStore.login}
			</a>
		{:else}
			<ul>
				<li>
					<a target="_blank" rel="noopener noreferrer" class="link" href="https://github.com/signup"
						>Create a GitHub account</a
					>, if you don't have one already.
				</li>
				<li>Create a new user access token:</li>
				<ul>
					<li>
						Go to the
						<a
							target="_blank"
							rel="noopener noreferrer"
							class="link"
							href="https://github.com/settings/tokens/new">GitHub access token creation page</a
						>.
					</li>
					<li>Insert any text under "Note".</li>
					<li>
						Select "repo" (should be the first checkbox). This will automatically select all the
						checkboxes under "repo".
					</li>
					<li>Scroll down and click "Generate token"</li>
				</ul>
				<li>
					Copy the newly generated token. The format is something like <code
						class="text-sm bg-dark p-1">ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code
					>.
				</li>
				<li>Paste the token in this page.</li>
				<li>Press "Authenticate"</li>
			</ul>
		{/if}
	</p>
	<div class="flex w-full gap-4 mb-4">
		<TextInput
			bind:value={githubToken}
			label="GitHub user access token"
			id="gh-access-token"
			placeholder="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
			buttonText="Authenticate"
			on:click={handleClickAuthenticate}
			password
		/>
	</div>
	{#if errorMessage}
		<p>
			{errorMessage}
		</p>
	{/if}
	<slot />
</PageLayout>
