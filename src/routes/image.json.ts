import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';

const getPath = (relativePath: string) => path.join(process.cwd(), relativePath);

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

export const get: RequestHandler = async ({ query }) => {
	const imageUrl = query.get('src');

	if (!imageUrl) {
		return {
			status: 400,
			body: 'Missing src query parameter'
		};
	}

	const encodedImageUrl = encodeURIComponent(imageUrl);

	console.log('11');

	const downloadedImagePath = await downloadImage(imageUrl, encodedImageUrl);

	console.log('12');
	if (!downloadedImagePath) {
		return {
			status: 500,
			body: 'Failed to download image'
		};
	}

	console.log('13');

	const optimizedDir = 'tmp/optimized';

	if (!fs.existsSync(optimizedDir)) {
		await fsp.mkdir(optimizedDir, { recursive: true });
	}

	const image = await sharp(downloadedImagePath)
		.resize({ width: 10, height: 10 })
		.toFile(`${optimizedDir}/${encodedImageUrl}.jpg`);

	console.log('image', image);

	return {
		body: {}
	};
};
