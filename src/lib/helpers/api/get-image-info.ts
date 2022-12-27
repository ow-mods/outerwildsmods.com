import sharp from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import type { ImageInfo } from './get-image-map';
import type { Mod } from './get-mod-database';
import { getRawContentUrl } from '../get-raw-content-url';

const getPath = (relativePath: string) => path.join(process.cwd(), relativePath);

const hash = (input: string) => {
	let hash = 0,
		i,
		chr;
	if (input.length === 0) return hash;
	for (i = 0; i < input.length; i++) {
		chr = input.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

export const downloadImage = async (imageUrl: string, fileName: string): Promise<string | null> => {
	const response = await fetch(imageUrl);

	if (!response.ok) {
		return null;
	}

	const temporaryDirectory = 'tmp/original';

	if (!fs.existsSync(temporaryDirectory)) {
		await fsp.mkdir(temporaryDirectory, { recursive: true });
	}

	const relativeImagePath = `${temporaryDirectory}/${fileName}`;
	const fullImagePath = getPath(relativeImagePath);

	const image = await response.arrayBuffer();
	await fsp.writeFile(fullImagePath, Buffer.from(image));

	return fullImagePath;
};

export const getImageInfo = async (mod: Mod, imageUrl: string): Promise<ImageInfo | null> => {
	const rawContentUrl = getRawContentUrl(mod);

	const fullImageUrl = imageUrl.startsWith('http')
		? // GitHub allows embedding images that actually point to webpages on github.com, so we have to replace the URLs here
		  imageUrl.replace(
				/^https?:\/\/github.com\/(.+)\/(.+)\/blob\/(.+)\//gm,
				'https://raw.githubusercontent.com/$1/$2/$3/'
		  )
		: // For relative URLs we also have to resolve them
		  `${rawContentUrl}/${imageUrl}`;

	const encodedImageUrl = hash(imageUrl).toString();

	const downloadedImagePath = await downloadImage(fullImageUrl, encodedImageUrl);

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
