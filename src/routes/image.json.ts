import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';

const getPath = (relativePath: string) => path.join(process.cwd(), relativePath);

export const downloadImage = async (
	baseUrl: string,
	modName: string,
	imageUrl: string
): Promise<string | null> => {
	const response = await fetch(`${baseUrl}/${imageUrl}`);

	if (!response.ok) {
		return null;
	}

	const image = await response.arrayBuffer();
	const filePath = `/${encodeURIComponent(`images/external/${modName}/${imageUrl}`)}`;
	const publicPath = `public${filePath}`;

	const publicDirectory = path.dirname(publicPath);
	if (!fs.existsSync(publicDirectory)) {
		await fsp.mkdir(publicDirectory, { recursive: true });
	}

	const fullPath = getPath(publicPath);
	await fsp.writeFile(fullPath, Buffer.from(image));

	return fullPath;
};

export const get: RequestHandler = async ({ query }) => {
	const imageSource = query.get('src');

	if (!imageSource) {
		return {
			status: 400,
			body: 'Missing src query parameter'
		};
	}

	const downloadedImagePath = await downloadImage(
		'https://outerwildsmods.com',
		'test',
		'_next/image/?url=%2Fimages%2Fmod-manager-small.png&w=1200&q=75'
	);

	if (!downloadedImagePath) {
		return {
			status: 500,
			body: 'Failed to download image'
		};
	}

	const image = await sharp(downloadedImagePath)
		.resize({ width: 10, height: 10 })
		.toFile('static/converted.jpg');

	console.log('image', image);

	return {
		body: {}
	};
};
