import type { RequestHandler } from '@sveltejs/kit';
import { modList } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';

export const get: RequestHandler = async () => {
	const mods = await readFromStore(modList);
	const tags: Set<string> = new Set();

	for (const mod of mods) {
		for (const tag of mod.tags) {
			tags.add(tag);
		}
	}

	return {
		body: JSON.stringify(tags),
	};
};
