import { sveltekit } from '@sveltejs/kit/vite';

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
