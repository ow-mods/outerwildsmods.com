import sharp from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import type { ImageInfo } from './get-image-map';
import type { Mod } from './get-mod-database';
import { getRawContentUrl } from '../get-raw-content-url';

const getPath = (relativePath: string) => path.join(process.cwd(), relativePath);

export const getImageInfo = async (
	mod: Mod,
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
		throw new Error(`Failed to download image ${fullImageUrl}`);
	}

	const sharpImage = sharp(downloadedImagePath, { animated: true, limitInputPixels: false });
	const imageMetadata = await sharpImage.metadata();
	const width = imageMetadata.width;
	const height = imageMetadata.height;

	if (!width || !height) {
		throw new Error('failed to read image dimensions');
	}

	return {
		url: fullImageUrl,
		openGraphUrl: fullImageUrl,
		width,
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
	const response = await fetch(imageUrl);

	if (!response.ok) {
		console.log(`Failed to download image ${imageUrl}: ${response.statusText}`);
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
