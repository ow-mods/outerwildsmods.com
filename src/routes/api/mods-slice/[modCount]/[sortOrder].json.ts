import type { RequestHandler } from '@sveltejs/kit';
import { modList } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';
import { isSortOrder, sortModList } from '$lib/helpers/mod-sorting';

type Params = {
	modCount: string;
	sortOrder: string;
};

export const get: RequestHandler<Params> = async ({ params }) => {
	const { modCount, sortOrder } = params;

	const modCountNumber = parseInt(modCount);

	if (isNaN(modCountNumber)) {
		return {
			status: 500,
			body: `modCount (${modCount}) is NaN.`,
		};
	}

	if (!isSortOrder(sortOrder)) {
		return {
			status: 500,
			body: `sortOrder (${sortOrder}) isn't a valid sort order.`,
		};
	}

	const mods = await readFromStore(modList);
	const sortedMods = sortModList(mods, sortOrder);

	return {
		body: JSON.stringify(
			sortedMods
				.filter((mod) => !mod.utility)
				.map((mod) => mod.uniqueName)
				.slice(0, modCountNumber)
		),
	};
};
