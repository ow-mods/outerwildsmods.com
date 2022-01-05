<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import PasswordInput from '$lib/components/mod-editor/password-input.svelte';
	import { githubUser, octokit } from '$lib/store';
	import { Octokit } from 'octokit';

	let errorMessage: string;
	let githubToken = (import.meta.env['VITE_GITHUB_TOKEN'] as string) || '';

	const handleClickAuthenticate = async () => {
		try {
			$octokit = new Octokit({ auth: githubToken });

			if (!$octokit) return;

			const authResponse = await $octokit.rest.users.getAuthenticated();

			if (!authResponse.data) {
				throw new Error('Missing auth response data');
			}

			githubUser.set(authResponse.data);
		} catch (error) {
			errorMessage = `Error authenticating: ${error}`;
		}
	};

	const handleClickSignOut = () => {
		$githubUser = undefined;
	};
</script>

<PageLayout isWide>
	<PageSection title="Create New Horizons Addon" id="create-addon">
		{#if $githubUser}
			<div class="flex gap-4">
				<div class="flex-1">
					<slot />
				</div>
				<div class="w-52 rounded bg-dark p-4 flex flex-col gap-4">
					<div class="pr-4">
						<a class="link" target="_blank" rel="noopener noreferrer" href={$githubUser.html_url}>
							{$githubUser.login}
						</a>
					</div>
					<LinkButton on:click={handleClickSignOut}>Sign out</LinkButton>
				</div>
			</div>
		{:else}
			<p>
				This page is meant to simplify the creation of custom worlds for Outer Wilds. If you are
				familiar with programming, git repositories, and similar concepts, you might not need this
				tool. If you'd like to have full control of your addon, please follow the
				<a
					target="_blank"
					rel="noopener noreferrer"
					class="link"
					href="https://github.com/xen-42/ow-new-horizons-config-template#readme"
				>
					planet creation template instructions
				</a>
				to set everything up yourself.
			</p>
			<p>
				If you want to use this tool to create and share your custom worlds with other players,
				you'll first need to authenticate with a GitHub account:
			</p>
			<ul>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						class="link"
						href="https://github.com/signup"
					>
						Create a GitHub account
					</a>, if you don't have one already.
				</li>
				<li>Create a new user access token:</li>
				<ul>
					<li>
						Go to the
						<a
							target="_blank"
							rel="noopener noreferrer"
							class="link"
							href="https://github.com/settings/tokens/new"
						>
							GitHub access token creation page
						</a>.
					</li>
					<li>Insert any text under "Note".</li>
					<li>
						Select "repo" (should be the first checkbox). This will automatically select all the
						checkboxes within "repo".
					</li>
					<li>Scroll down and click "Generate token".</li>
				</ul>
				<li>
					Copy the newly generated token. The format is something like <code
						class="text-sm bg-dark p-1">ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code
					>. I recommend saving the token in a password manager for easier access later. If you lose
					your token, you can always just generate another one.
				</li>
				<li>Paste the token in this page and press "Authenticate".</li>
			</ul>
			<div class="flex w-full gap-4 mb-4">
				<PasswordInput
					bind:value={githubToken}
					label="GitHub user access token"
					id="gh-access-token"
					placeholder="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
					buttonText="Authenticate"
					on:submit={handleClickAuthenticate}
				/>
			</div>
			<p class="text-sm">
				Hint: If you leave or refresh this page, you'll be logged out. Save the token in a password
				manager so you don't have to generate a new one every time.
			</p>
			<slot />
		{/if}
		{#if errorMessage}
			<p>
				{errorMessage}
			</p>
		{/if}</PageSection
	>
</PageLayout>
