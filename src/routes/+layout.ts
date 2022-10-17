import type { Load } from '@sveltejs/kit';
import { modList } from '$lib/store';
import { setUpTags } from '$lib/helpers/set-up-tags';

export const csr = false;
export const prerender = true;

export const load: Load = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods');
	const starData = await fetch('/api/stars');

	if (modsResult.ok) {
		const newModList = await modsResult.json();
		modList.set(newModList);
		setUpTags(newModList);

		return {
			props: {
				starData: await starData.json(),
			},
		};
	}
};
