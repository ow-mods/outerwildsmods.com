import { type RequestHandler, error, json } from '@sveltejs/kit';
import { getModList } from '$lib/helpers/api/get-mod-list';

export const GET: RequestHandler = async () => {
	try {
		const modList = await getModList();
		return json(modList);
	} catch (e) {
		throw error(500, `Failed to get mod list: ${e}`);
	}
};
