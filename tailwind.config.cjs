const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				white: '#ffffff',
				black: '#000000',
				accent: '#df8460',
				'accent-light': '#f0c6b5',
				cta: '#35823f',
				background: '#1f2122',
				light: 'rgba(255, 255, 255, 0.65)',
				dark: '#191a1b'
			},
			borderRadius: {
				DEFAULT: '0.75rem'
			}
		}
	},

	plugins: []
};

module.exports = config;
