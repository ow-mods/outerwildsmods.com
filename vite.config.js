import { sveltekit } from '@sveltejs/kit/vite';

// Need to do this here, otherwise we'd get a "failed to self-register" error.
require('sharp');

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: ["sharp"]
		},
	},
	ssr: {
		external: ["sharp"]
	}
};

export default config;
