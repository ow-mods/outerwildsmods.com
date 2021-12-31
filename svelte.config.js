import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			onError: ({ status, path, referrer, referenceType }) => {
				if (path.startsWith('/images/optimized/')) {
					console.log(`Failed to find path, but presuming that's ok: ${path}`);
					return;
				}
				throw new Error(
					`Failed to find path. status: ${status}, path: ${path}, referrer: ${referrer}, referenceType: ${referenceType}`
				);
			},
		},
		target: '#svelte',
	},
};

export default config;
