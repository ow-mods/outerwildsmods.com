/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false,
	},
	theme: {
		colors: {
			white: '#ffffff',
			black: '#000000',
			accent: '#ffab8a',
			'accent-light': '#f0c6b5',
			cta: '#35823f',
			'cta-dark': '#27632f',
			background: '#1f2122',
			light: 'rgba(255, 255, 255, 0.65)',
			dark: '#191a1b',
			transparent: 'transparent',
		},
		extend: {
			fontSize: {
				sm: '0.85em',
			},
		},
	},
	plugins: [],
};

module.exports = config;
