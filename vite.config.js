import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const month = new Date().getMonth();

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
			prerender: {
				entries: ['*'],
				handleMissingId: 'warn',
			},
			paths: {
				relative: false,
			},
		}),
	],
	define: {
		IS_WINTER: month >= 11 || month <= 1,
	},
};

export default config;
