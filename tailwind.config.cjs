/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false,
	},
	theme: {
		screens: {
			xs: '480px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
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
			error: '#f04747',
		},
		extend: {
			fontSize: {
				base: '1.1rem',
			},
			aspectRatio: {
				modThumbnail: '1 / 3',
			},
		},
	},
	plugins: [],
};

module.exports = config;
