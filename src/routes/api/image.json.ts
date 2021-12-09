import type { RequestHandler } from '@sveltejs/kit';
import sharp, { FitEnum } from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';

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

const validFits: (keyof FitEnum)[] = ['contain', 'cover', 'fill', 'inside', 'outside'];

export const get: RequestHandler = async ({ query }) => {
	const imageUrl = query.get('imageUrl');
	const widthParam = query.get('width');
	const heightParam = query.get('height');
	const fit = (query.get('fit') || 'cover') as keyof FitEnum;

	if (!imageUrl) {
		return {
			status: 400,
			body: 'Missing imageUrl query parameter'
		};
	}

	if (!validFits.includes(fit)) {
		return {
			status: 400,
			body: `Invalid fit. Must be one of ${validFits}`
		};
	}

	const encodedImageUrl = hash(imageUrl).toString();

	const downloadedImagePath = await downloadImage(imageUrl, encodedImageUrl);

	if (!downloadedImagePath) {
		return {
			status: 500,
			body: 'Failed to download image'
		};
	}

	const sharpImage = sharp(downloadedImagePath);
	const imageMetadata = await sharpImage.metadata();
	const width = widthParam ? parseInt(widthParam) : imageMetadata.width;
	const height = heightParam ? parseInt(heightParam) : imageMetadata.height;

	const staticDir = 'static';
	const optimizedDir = '/images/optimized';
	const fileOutputDir = `${staticDir}${optimizedDir}`;
	const fileName = `${encodedImageUrl}-w${width}h${height}f${fit}.webp`;
	const optimizedImagePath = `${fileOutputDir}/${fileName}`;

	if (!fs.existsSync(fileOutputDir)) {
		await fsp.mkdir(fileOutputDir, { recursive: true });
	}

	await sharpImage.resize({ width, height, fit, position: 'left' }).toFile(optimizedImagePath);

	return {
		body: JSON.stringify({
			imagePath: `${optimizedDir}/${fileName}`,
			width,
			height
		})
	};
};
