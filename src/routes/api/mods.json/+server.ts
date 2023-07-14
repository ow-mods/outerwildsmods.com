import { type RequestHandler, error } from '@sveltejs/kit';
import { getModList } from '$lib/helpers/api/get-mod-list';

export const GET: RequestHandler = async () => {
	try {
		const modList = getModList();
		return new Response(JSON.stringify(modList));
	} catch (e) {
		throw error(500, `Failed to get mod list: ${e}`);
	}
};
