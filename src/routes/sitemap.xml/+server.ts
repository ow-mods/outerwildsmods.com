import type { RequestHandler } from '@sveltejs/kit';
import { getModList } from '#lib/helpers/api/get-mod-list';
import { getRelatedMods, MAX_RELATED_MODS } from '#lib/helpers/get-related-mods';
import { websiteUrl } from '#lib/helpers/constants';

export const prerender = true;

const pageModules = import.meta.glob('/src/routes/**/+page.svelte');

const getStaticPaths = () =>
	Object.keys(pageModules)
		.filter((file) => !file.includes('['))
		.map((file) => file.slice('/src/routes'.length).replace(/\/\+page\.svelte$/, '') || '/')
		.filter((path) => path !== '/404')
		.filter((path) => !path.split('/').some((segment) => segment.startsWith('(')))
		.map((path) => (path === '/' ? path : `${path}/`));

export const GET: RequestHandler = async () => {
	const modList = await getModList();
	const modsWithRelatedModsPage = new Set(
		modList
			.filter((mod) => getRelatedMods(mod, modList).length > MAX_RELATED_MODS)
			.map((mod) => mod.uniqueName)
	);
	const modPaths = modList.flatMap((mod) => {
		const paths = [`/mods/${mod.slug}/`];

		if (modsWithRelatedModsPage.has(mod.uniqueName)) {
			paths.push(`/mods/${mod.slug}/addons/`);
		}

		return paths;
	});

	const paths = [...new Set([...getStaticPaths(), ...modPaths])].sort();
	const urls = paths.map((path) => `\n  <url><loc>${websiteUrl}${path}</loc></url>`).join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;

	return new Response(sitemap, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	});
};
