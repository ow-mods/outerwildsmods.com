import { getModDatabase, type Mod } from '$lib/helpers/api/get-mod-database';
import { thumbnailUrlBase, websiteUrl } from '$lib/helpers/constants';
import { sortOrders } from '$lib/helpers/mod-sorting';

export const GET = async () => {
	const headers = {
		'Content-Type': 'application/xml',
	};
	const database = await getModDatabase();
	const mods = database.releases.sort(sortOrders.newest.compareFunction);

	return new Response(xml(mods), { headers });
};

function escapeXml(unsafe: string) {
	return unsafe.replace(/[<>&'"]/g, (substring: string) => {
		switch (substring) {
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '&':
				return '&amp;';
			case "'":
				return '&apos;';
			case '"':
				return '&quot;';
			default:
				return '';
		}
	});
}

const xml = (mods: Mod[]) => `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
   <title>Outer Wilds Mods</title>
   <description>List of mods for Outer Wilds</description>
   <link>${escapeXml(websiteUrl)}</link>
   <atom:link href="${escapeXml(websiteUrl)}/rss/mods"
     rel="self" type="application/rss+xml" />
  <image>${escapeXml(websiteUrl)}/images/icon-large.png</image>
${mods.map(
	(mod) => `
    <item>
      <title>${escapeXml(mod.name)}</title>
      <link>${escapeXml(websiteUrl)}/mods/${escapeXml(mod.slug)}</link>
      <guid>${escapeXml(mod.uniqueName)}</guid>
      <pubDate>${escapeXml(mod.firstReleaseDate)}</pubDate>
      <description>
        ${escapeXml(mod.description)}
        ${
					mod.thumbnail.main
						? `<![CDATA[
           <br></br>
           <img src="${escapeXml(`${thumbnailUrlBase}/${mod.thumbnail.main}`)}">
        ]]>`
						: ''
				}
      </description>
    </item>
`
)}
</channel>
</rss>
`;
