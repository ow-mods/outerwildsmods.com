/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false,
	},
	theme: {
		colors: {
			white: '#ffffff',
			black: '#000000',
			accent: '#ffab8a',
			cta: '#35823f',
			background: '#1f2122',
			light: 'rgba(255, 255, 255, 0.65)',
			dark: '#191a1b',
			darker: '#121416',
			transparent: 'transparent',
		},
		extend: {
			fontSize: {
				base: '1.1rem',
			},
		},
	},
	plugins: [],
};

module.exports = config;
