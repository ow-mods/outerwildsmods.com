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
			// TODO maybe not
			onError: 'continue',
		},
		target: '#svelte',
		vite: {
			optimizeDeps: {
				exclude: ['octokit'],
			},
		},
	},
};

export default config;
