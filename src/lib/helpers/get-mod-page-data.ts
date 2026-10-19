import { browser } from '$app/env';
import { error } from '@sveltejs/kit';
import type { Mod } from './api/get-mod-list';
import type { HeadingStructure } from './api/get-mod-readme';
import { getModBySlug } from './get-mod-by-slug';

export interface ModPageData {
	mod: Mod;
	readmeHtml?: string;
	headingStructure?: HeadingStructure[];
}

interface Options {
	slug: string;
	modList: Mod[];
	fetch: typeof fetch;
}

export const getModPageData = async ({
	slug,
	modList,
	fetch,
}: Options): Promise<ModPageData | null> => {
	let mod = getModBySlug(modList, slug);

	if (!mod && browser) {
		try {
			const { getLiveModBySlug } = await import('./api/mod-from-database');
			mod = await getLiveModBySlug(slug);
		} catch (error) {
			console.error(`Failed to load live mod database: ${error}`);
		}
	}

	if (!mod) return null;

	const result = await fetch(`/api/${mod.uniqueName}.json`);

	let readmeHtml: string | undefined;
	let headingStructure: HeadingStructure[] | undefined;

	if (result.ok) {
		const json = await result.json();
		readmeHtml = json.readmeHtml;
		headingStructure = json.headingStructure;
	} else if (browser) {
		const { getModReadmeClient } = await import('./api/get-mod-readme-client');
		const readme = await getModReadmeClient(mod, fetch);
		readmeHtml = readme?.html;
		headingStructure = readme?.headings;
	} else {
		error(result.status, `Could not load mod. ${await result.text()}`);
	}

	return {
		mod,
		readmeHtml,
		headingStructure,
	};
};
