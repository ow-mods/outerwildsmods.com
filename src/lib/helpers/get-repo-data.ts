import type { OctokitRepo } from '$lib/octokit';
import { octokit } from '$lib/store';

export const getRepoData = async (owner: string, repo: string) =>
	new Promise<OctokitRepo | undefined>((resolve, reject) => {
		octokit.subscribe(async ($octokit) => {
			try {
				if (!$octokit) {
					reject('Octokit store not available');
					return;
				}

				resolve((await $octokit.rest.repos.get({ owner, repo })).data);
			} catch (error) {
				reject(error);
			}
		});
	});
