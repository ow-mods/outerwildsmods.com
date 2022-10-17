import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['marked'],
	},
	resolve: {
		alias: {
			'node-fetch': 'isomorphic-fetch',
		},
	},
};

export default config;
