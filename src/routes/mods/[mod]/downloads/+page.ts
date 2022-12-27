import type { HistoryPoint } from '$lib/helpers/api/history-points';
import { readFromStore } from '$lib/helpers/read-from-store';
import { modList } from '$lib/store';
import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const mods = await readFromStore(modList);
	const currentMod = mods.find(({ slug }) => params.mod === slug);

	if (!currentMod) {
		throw error(404, `Could not find mod ${params.mod}`);
	}

	const modDownloadHistoryResponse = await fetch(`/api/${currentMod.uniqueName}/downloads.json`);

	if (modDownloadHistoryResponse.status !== 200) {
		console.error(
			`Failed to get mod download history from local API: ${modDownloadHistoryResponse.status}. ${modDownloadHistoryResponse.statusText}`
		);
		return {
			modDownloadHistory: [],
			mod: currentMod
		};
	}

	const modDownloadHistory: HistoryPoint[] = await modDownloadHistoryResponse.json();

	return {
		modDownloadHistory,
		mod: currentMod
	};
};
