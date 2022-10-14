import type { RequestHandler } from '@sveltejs/kit';
import type sharp from 'sharp';
import { listedImageSize } from '$lib/helpers/constants';
import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { Mod } from '$lib/helpers/api/get-mod-database';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { formatNumber } from '$lib/helpers/format-number';
import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';
import { getImageMap } from '$lib/helpers/api/get-image-map';
import { modList } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';

const supportedTypes: (keyof sharp.FormatEnum)[] = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
	'raw',
	'tif',
	'tiff',
];

export interface ModsRequestItem extends Mod {
	imageUrl: string | null;
	openGraphImageUrl: string | null;
	formattedDownloadCount: string;
	rawContentUrl: string | null;
}

export const get: RequestHandler = async () => {
	const cachedModList = await readFromStore(modList);
	if (cachedModList && cachedModList.length > 0) {
		return {
			body: JSON.stringify(cachedModList),
		};
	}

	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500,
			body: 'Failed to retrieve database',
		};
	}

	const allReleases = [...modDatabase.releases, ...modDatabase.alphaReleases];

	const modsResult = await Promise.allSettled(
		allReleases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod);
			let imageUrl: string | null = null;
			let openGraphImageUrl: string | null = null;

			try {
				const thumbnail = await getModThumbnail(mod);

				const externalImages =
					thumbnail && rawContentUrl
						? await getImageMap(
								rawContentUrl,
								[thumbnail],
								listedImageSize.width,
								listedImageSize.height
						  )
						: {};

				const firstExternalImage = Object.values(externalImages).filter(
					(image) => image?.format && supportedTypes.includes(image.format)
				)[0];

				imageUrl = firstExternalImage?.url ?? null;
				openGraphImageUrl = firstExternalImage?.openGraphUrl ?? null;
			} catch (error) {
				console.error(`Failed to retrieve thumbnail image for ${mod.uniqueName}: ${error}`);
			}
			return {
				...mod,
				imageUrl,
				openGraphImageUrl,
				formattedDownloadCount: formatNumber(mod.downloadCount),
				rawContentUrl,
				tags: mod.tags.length > 0 ? mod.tags : ['untagged'],
			};
		})
	);

	const mods = modsResult.filter(filterFulfilledPromiseSettleResults).map((result) => result.value);

	modList.set(mods);

	return { body: JSON.stringify(mods) };
};

function filterFulfilledPromiseSettleResults<T>(
	result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
	return result.status === 'fulfilled';
}
