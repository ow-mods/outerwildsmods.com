import { writeFileSync, renameSync, existsSync } from 'fs';
import { globby } from 'globby';

const urlBase = 'https://outerwildsmods.com';

const generateSitemap = async () => {
	const pages = await globby(['build/**/*.html', '!build/404*']);

	const pageUrls = pages
		.map((page) => {
			const path = `${urlBase}/${page.replace(/(index|.html|build\/)/gm, '')}`;
			return `\n  <url><loc>${path}</loc></url>`;
		})
		.join('');

	const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageUrls}\n</urlset>`;

	writeFileSync('build/sitemap.xml', sitemap);
};

const move404 = () => {
	const path404 = 'build/404/index.html';
	if (existsSync(path404)) {
		renameSync(path404, 'build/404.html');
	}
};

generateSitemap();
move404();
