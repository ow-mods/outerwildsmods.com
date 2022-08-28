import sharp, { FitEnum } from 'sharp';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import type { ImageInfo } from './get-image-map';

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

export const getOptimizedImage = async (
	imageUrl: string,
	resizeWidth?: number,
	resizeHeight?: number
): Promise<ImageInfo | null> => {
	const encodedImageUrl = hash(imageUrl).toString();

	const downloadedImagePath = await downloadImage(imageUrl, encodedImageUrl);

	if (!downloadedImagePath) {
		throw new Error(`Failed to download image ${imageUrl}`);
	}

	const sharpImage = sharp(downloadedImagePath, { animated: true });
	const imageMetadata = await sharpImage.metadata();
	const width = Math.min(800, resizeWidth ?? imageMetadata.width ?? 0);
	const resizeRatio = imageMetadata.width ? width / imageMetadata.width : 1;
	const height = resizeHeight ?? imageMetadata.height ?? 0 * resizeRatio;
	const format = imageMetadata.format;
	const isSvg = format === 'svg';
	const isAnimatedThumbnail = Boolean(resizeWidth) && (imageMetadata.pages ?? 0) > 1;

	if (!width || !height) {
		throw new Error('failed to read image dimensions');
	}

	const fit: keyof FitEnum = resizeWidth ? 'cover' : 'inside';

	const staticDir = import.meta.env.PROD ? 'build' : 'static';
	const optimizedDir = '/images/optimized';
	const fileOutputDir = `${staticDir}${optimizedDir}`;

	// TODO file name doesn't reflect real size. Maybe it shouldn't 🤷‍♂️
	const getFileName = (extension: string) =>
		`${encodedImageUrl}-w${width}h${height}f${fit}.${extension}`;

	const fileName = getFileName(isSvg ? 'svg' : 'webp');
	const optimizedImagePath = `${fileOutputDir}/${fileName}`;

	if (!fs.existsSync(fileOutputDir)) {
		await fsp.mkdir(fileOutputDir, { recursive: true });
	}

	const fullOptimizedImageUrl = `${optimizedDir}/${fileName}`;

	if (isSvg) {
		await fsp.copyFile(downloadedImagePath, optimizedImagePath);

		return {
			url: fullOptimizedImageUrl,
			openGraphUrl: fullOptimizedImageUrl,
			width,
			height,
			format,
		};
	} else {
		const resizedSharpImage = sharpImage.resize({ width, height, fit, position: 'left' });
		const resizedImage = await resizedSharpImage.toFile(optimizedImagePath);

		let openGraphUrl = fullOptimizedImageUrl;

		if (isAnimatedThumbnail) {
			const openGraphFileName = getFileName('gif');
			const openGraphImagePath = `${fileOutputDir}/${openGraphFileName}`;
			openGraphUrl = `${optimizedDir}/${openGraphFileName}`;

			await resizedSharpImage.toFile(openGraphImagePath);
		}

		return {
			url: fullOptimizedImageUrl,
			openGraphUrl,
			width: resizedImage.width,
			height: resizedImage.height / (imageMetadata.pages ?? 1),
			format,
		};
	}
};
