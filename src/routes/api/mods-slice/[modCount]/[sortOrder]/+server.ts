import { modList } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';
import { isSortOrder, sortModList } from '$lib/helpers/mod-sorting';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { modCount, sortOrder } = params;

	const modCountNumber = parseInt(modCount);

	if (isNaN(modCountNumber)) {
		return new Response(`modCount (${modCount}) is NaN.`, { status: 500 });
	}

	if (!isSortOrder(sortOrder)) {
		return new Response(`sortOrder (${sortOrder}) isn't a valid sort order.`, { status: 500 });
	}

	const mods = await readFromStore(modList);
	const sortedMods = sortModList(mods, sortOrder);

	return new Response(
		JSON.stringify(
			sortedMods
				.filter((mod) => !mod.utility)
				.map((mod) => mod.uniqueName)
				.slice(0, modCountNumber)
		)
	);
};

export const prerender = true;
