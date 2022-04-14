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

				throw new Error(
					`Failed to find path. status: ${status}, path: ${path}, referrer: ${referrer}, referenceType: ${referenceType}`
				);
			},
			concurrency: 2,
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
