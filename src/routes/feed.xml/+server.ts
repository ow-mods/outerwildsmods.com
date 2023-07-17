import { getModList, type Mod } from '$lib/helpers/api/get-mod-list';
import { thumbnailUrlBase, websiteUrl } from '$lib/helpers/constants';
import { sortOrders } from '$lib/helpers/mod-sorting';

export const GET = async () => {
	const modList = await getModList();
	const mods = modList.sort(sortOrders.newest.compareFunction);

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

function mergeDateInWeek(date: Date) {
	const dayToSplit = 3;
	let amountToAdd: number = dayToSplit - date.getDay();
	if (date.getDay() > dayToSplit) {
		amountToAdd += 7;
	}
	const newDate: Date = date;
	newDate.setDate(newDate.getDate() + amountToAdd);
	return newDate;
}

function splitModsByReleaseDate(mods: Mod[]) {
	const mapOfMods: Record<string, Mod[]> = {};
	mods.forEach((mod: Mod) => {
		const releaseDate: Date = new Date(mod.firstReleaseDate);
		const key: string = mergeDateInWeek(releaseDate).toDateString();
		if (!mapOfMods[key]) {
			mapOfMods[key] = [];
		}
		mapOfMods[key].push(mod);
		return mapOfMods;
	});
	//console.log(mapOfMods);
	return [...Object.values(mapOfMods)];
}

function renderModRelease(mod: Mod) {
	return `<li>
      	<a href="${mod.repo}">${escapeXml(mod.name)}</a> by ${escapeXml(
		mod.authorDisplay ?? mod.author
	)} (${escapeXml(new Date(mod.firstReleaseDate).toDateString())}) &#10145; ${escapeXml(
		mod.description
	)}
        ${
					mod.thumbnail.main
						? `<br></br>
            <img src="${escapeXml(`${thumbnailUrlBase}/${mod.thumbnail.main}`)}">`
						: ''
				}</li>`;
}

function weeklyModsRelease(mods: Mod[]) {
	const releaseWeek: Date = mergeDateInWeek(new Date(mods[0].firstReleaseDate));
	const date: string = releaseWeek.toDateString();
	const splitDate: string[] = date.split(' ');
	const weekDay: string = splitDate[0];
	const month: string = splitDate[1];
	const day: string = splitDate[2];
	const year: string = splitDate[3];
	return `
    <item>
      <title>Week of ${escapeXml(month)} ${escapeXml(day)} ${escapeXml(year)}</title>
      <guid>${escapeXml(date)}</guid>
      <pubDate>${escapeXml(date)}</pubDate>
      <link>mods/?sortOrder=newest</link>
      <description>
      <![CDATA[
      <h>Mod Releases</h>
      <ul>
      ${mods
				.filter((mod) => !mod.tags.includes('library'))
				.map(renderModRelease)
				.join('')}
      </ul>
      <h>Library Releases</h>
      <ul>
      ${mods
				.filter((mod) => mod.tags.includes('library'))
				.map(renderModRelease)
				.join('')}
      </ul>
      ]]>
      </description>
    </item>
  `;
}

const xml = (mods: Mod[]) => `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
   <title>Outer Wilds Mods Weekly</title>
   <description>List of daily releases of mods for Outer Wilds</description>
   <link>${escapeXml(websiteUrl)}</link>
   <atom:link href="${escapeXml(websiteUrl)}/feed.xml"
     rel="self" type="application/rss+xml" />
  <image>${escapeXml(websiteUrl)}/images/icon-large.png</image>
${splitModsByReleaseDate(mods)
	.map((splitMods: Mod[]) => weeklyModsRelease(splitMods))
	.join('')}
</channel>
</rss>
`;

export const prerender = true;
