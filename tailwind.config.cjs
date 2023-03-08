/** @type {import('tailwindcss').Config} */
module.exports = {
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
			accent: '#ff9c86',
			cta: '#35823f',
			background: '#161a20',
			light: 'rgba(255, 255, 255, 0.65)',
			dark: '#12151a',
			darker: '#0b0d10',
			transparent: 'transparent',
			error: '#f04747',
		},
		extend: {
			fontSize: {
				base: '1.1rem',
			},
			aspectRatio: {
				thumbnail: '3 / 1',
			},
		},
	},
	plugins: [],
};
