import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
			preserve: ['module'],
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			onError: ({ status, path, referrer, referenceType }) => {
				// Generated optimized images won't be found by the crawler.
				// So I'm ignoring these errors.
				if (path.startsWith('/images/optimized/')) return;

				// Some images seem to still be missing.
				// Temporarily ignore them.
				// TODO: this needs to be fixed by using the original images at compile time.
				if (path.endsWith('.webp') || path.endsWith('.svg')) return;

				// Protocol URLs will 404 on prerender, gotta ignore those.
				if (path.includes('outer-wilds-mod://')) return;

				throw new Error(
					`Failed to find path. status: ${status}, path: ${path}, referrer: ${referrer}, referenceType: ${referenceType}`
				);
			},
			// Disabling concurrency because maybe that's causing the thumbnails to some times not be generated in time? dunno.
			// concurrency: 2,
		},
		trailingSlash: 'always',
		vite: {
			optimizeDeps: {
				exclude: ['marked'],
			},
			resolve: {
				alias: {
					'node-fetch': 'isomorphic-fetch',
				},
			},
		},
	},
};

export default config;
