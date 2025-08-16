import sharp from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import { getRawContentUrl } from '../get-raw-content-url';
import { type ModFromDatabase } from './get-mod-database';

const getPath = (relativePath: string) => path.join(process.cwd(), relativePath);

export type ImageInfo = {
	width?: number;
	height?: number;
	url: string;
};

export const getImageInfo = async (
	mod: ModFromDatabase,
	imageUrl: string,
	index: number
): Promise<ImageInfo | null> => {
	const rawContentUrl = getRawContentUrl(mod);

	if (rawContentUrl === null) {
		throw new Error(`Failed to get image info for ${mod.uniqueName}: missing raw content url`);
	}

	const fullImageUrl = getFullImageUrl(rawContentUrl, imageUrl);

	const downloadedImagePath = await downloadImage(fullImageUrl, mod.slug, index.toString());

	if (!downloadedImagePath) {
		return {
			url: fullImageUrl,
		};
	}

	const sharpImage = sharp(downloadedImagePath, { animated: true, limitInputPixels: false });
	const imageMetadata = await sharpImage.metadata();
	const width = imageMetadata.width;
	const height = imageMetadata.pageHeight ?? imageMetadata.height;

	if (!width || !height) {
		console.error(`Failed to read image dimensions for ${fullImageUrl}`);
		return {
			url: fullImageUrl,
		};
	}

	const isShieldsIo = new URL(fullImageUrl).host == 'img.shields.io';

	return {
		url: fullImageUrl,
		// Special case for shields.io.
		// We skip the width since that can easily change whenever shields throws some error,
		// which would then cause the image to render incorrectly.
		// So for shields.io images we provide only the height, since that part doesn't change.
		// This means we have a small SEO penalty, since there will be some layout shifts if the images wrap.
		// Note that this problem isn't specific to shields.io, just more common with it.
		// This whole process of reading image dimensions fails if the image for this URL changes after
		// the website is built.
		width: isShieldsIo ? undefined : width,
		height,
	};
};

// We download the image to a temporary folder, and we don't persist it,
// because we just want to read the image dimensions.
// Image dimensions are useful for SEO, since we can place them in the HTML to prevent\
// layout shifts during page loading.
export const downloadImage = async (
	imageUrl: string,
	slug: string,
	fileName: string
): Promise<string | null> => {
	try {
		const response = await fetch(imageUrl);

		if (!response.ok) {
			console.error(`Failed to download image ${imageUrl}: ${response.statusText}`);
			return null;
		}

		const temporaryDirectory = path.join('tmp', 'thumbnails', slug);

		if (!fs.existsSync(temporaryDirectory)) {
			await fsp.mkdir(temporaryDirectory, { recursive: true });
		}

		const imagePath = getPath(`${temporaryDirectory}/${fileName}`);

		const image = await response.arrayBuffer();
		await fsp.writeFile(imagePath, Buffer.from(image));

		return imagePath;
	} catch (error) {
		console.error(`Error downloading image ${imageUrl}: ${error}`);
		return null;
	}
};

const getFullImageUrl = (rawContentUrl: string, imageUrl: string) => {
	return imageUrl.startsWith('http')
		? // GitHub allows embedding images that actually point to webpages on github.com, so we have to replace the URLs here
			imageUrl.replace(
				/^https?:\/\/github.com\/(.+)\/(.+)\/blob\/(.+)\//gm,
				'https://raw.githubusercontent.com/$1/$2/$3/'
			)
		: // For relative URLs we also have to resolve them
			`${rawContentUrl}/${imageUrl}`;
};
