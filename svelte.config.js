import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			// TODO maybe not
			onError: 'continue',
		},
		target: '#svelte',
		vite: {
			optimizeDeps: {
				exclude: ['marked'],
			},
		},
	},
};

export default config;
