import { sveltekit } from '@sveltejs/kit/vite';

const month = new Date().getMonth();

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		IS_WINTER: month >= 11 || month <= 1,
	},
};

export default config;
