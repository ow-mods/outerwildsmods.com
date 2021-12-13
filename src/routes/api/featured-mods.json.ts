import type { RequestHandler } from '@sveltejs/kit';
import { modsStore } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';

export const get: RequestHandler = async () => {
	const mods = await readFromStore(modsStore);

	return {
		body: JSON.stringify(
			mods
				.filter((mod) => mod.imageUrl && !mod.utility)
				.map((mod) => mod.uniqueName)
				.sort(() => Math.random() * 2 - 1)
				.slice(0, 4)
		),
	};
};
