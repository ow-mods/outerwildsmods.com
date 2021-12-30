<script lang="ts">
	import { page } from '$app/stores';
	import type { OctokitRepo } from '$lib/octokit';
	import { octokitStore } from '$lib/store';

	let repo: OctokitRepo | undefined;

	$: (async () => {
		let repoResponse = await $octokitStore?.rest.repos.get({
			owner: $page.params.userName,
			repo: $page.params.repoName,
		});

		// TODO: handle errors. Maybe using a custom error page for this level?

		repo = repoResponse?.data;
	})();
</script>

<h2>{repo?.name}</h2>
