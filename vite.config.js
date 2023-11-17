import { sveltekit } from '@sveltejs/kit/vite';

// Need to do this here, otherwise we'd get a "failed to self-register" error.
import "sharp";

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
};

export default config;
