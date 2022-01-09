import { octokit } from '$lib/store';

export type Manifest = {
	name: string;
	version: string;
	uniqueName: string;
	[key: string]: unknown;
};

export const getManifest = async (owner: string, repo: string) =>
	new Promise<Manifest | undefined>((resolve, reject) => {
		octokit.subscribe(async ($octokit) => {
			try {
				if (!$octokit) reject('Octokit store not available');

				// The type definitions here suck, have to use any.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const manifestData: any = (
					await $octokit?.rest.repos.getContent({
						owner,
						repo,
						path: 'manifest.json',
					})
				)?.data;

				if (!manifestData) {
					reject('Unable to retrieve manifest');
				}

				return resolve(JSON.parse(atob(manifestData.content)));
			} catch (error) {
				reject(error);
			}
		});
	});
