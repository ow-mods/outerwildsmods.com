import type { HistoryPoint } from '$lib/helpers/api/history-points';
import { getModPathName } from '$lib/helpers/mod-path-name';
import { readFromStore } from '$lib/helpers/read-from-store';
import { modList } from '$lib/store';
import type { Load } from '@sveltejs/kit';

export const prerender = true;

export const load: Load = async ({ fetch, params }) => {
	const mods = await readFromStore(modList);
	const currentMod = mods.find(({ name }) => params.mod === getModPathName(name));

	if (!currentMod) {
		return {
			status: 404,
			error: new Error(`Could not find mod ${params.mod}`),
		};
	}

	const modDownloadHistoryResponse = await fetch(`/api/${currentMod.uniqueName}/downloads`);

	if (modDownloadHistoryResponse.status !== 200) {
		console.error(
			`Failed to get mod download history from local API: ${modDownloadHistoryResponse.status}. ${modDownloadHistoryResponse.statusText}`
		);
		return {
			props: {
				modDownloadHistory: [],
				mod: currentMod,
			},
		};
	}

	const modDownloadHistory: HistoryPoint[] = await modDownloadHistoryResponse.json();

	return {
		props: {
			modDownloadHistory,
			mod: currentMod,
		},
	};
};
