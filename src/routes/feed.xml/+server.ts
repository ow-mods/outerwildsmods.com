import { getModDatabase, type Mod } from '$lib/helpers/api/get-mod-database';
import { thumbnailUrlBase, websiteUrl } from '$lib/helpers/constants';
import { sortOrders } from '$lib/helpers/mod-sorting';

export const GET = async () => {
	const database = await getModDatabase();
	const mods = database.releases.sort(sortOrders.newest.compareFunction);

	return new Response(xml(mods));
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

function splitModsByReleaseDate(mods: Mod[]) {
	const mapOfMods: Map<string,Mod[]> = new Map();
  mods.forEach((mod: Mod) => { 
    const releaseDate: Date = new Date(mod.firstReleaseDate);
    const key: string = releaseDate.toDateString();
    if(!mapOfMods.has(key)){
  	  mapOfMods.set(key, []);
    }  
    mapOfMods.get(key).push(mod);
    return mapOfMods;
  });
  //console.log(mapOfMods);
  return [... mapOfMods.values()];
}

function dailyModsRelease(mods: Mod[]) {

	const releaseDate: Date = new Date(mods[0].firstReleaseDate);
  const date: string = releaseDate.toDateString();
	return `
    <item>
      <title>Mods Released in ${escapeXml(date)}</title>
      <guid>${escapeXml(date)}</guid>
      <pubDate>${escapeXml(date)}</pubDate>
      <link>mods/?sortOrder=newest</link>
      <description>
      <![CDATA[
      <ul>
      ${mods
      .map((mod)=>`
      	<li>
      	<a href="${mod.repo}">${escapeXml(mod.name)}</a> &#10145; ${escapeXml(mod.description)}
        ${
					mod.thumbnail.main
						? `<br></br>
           <img src="${escapeXml(`${thumbnailUrlBase}/${mod.thumbnail.main}`)}">`
						: ''
				}</li>`).join('')
      }
      </ul>
      ]]>
      </description>
    </item>
  `;
}

const xml = (mods: Mod[]) => `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
   <title>Outer Wilds Mods Daily Releases</title>
   <description>List of daily releases of mods for Outer Wilds</description>
   <link>${escapeXml(websiteUrl)}</link>
   <atom:link href="${escapeXml(websiteUrl)}/feed.xml"
     rel="self" type="application/rss+xml" />
  <image>${escapeXml(websiteUrl)}/images/icon-large.png</image>
${splitModsByReleaseDate(mods).
	map((splitMods: Mod[]) =>
	dailyModsRelease(splitMods)).join('')}
</channel>
</rss>
`;

export const prerender = true;
