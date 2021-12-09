const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		screens: {
			sm: '600.98px',
			md: '1101.98px',
			lg: '1999.98px'
		},
		extend: {
			colors: {
				white: '#ffffff',
				black: '#000000',
				accent: '#df8460',
				'accent-light': '#f0c6b5',
				cta: '#35823f',
				'cta-dark': '#27632f',
				background: '#1f2122',
				light: 'rgba(255, 255, 255, 0.65)',
				dark: '#191a1b'
			}
		}
	},
	plugins: []
};

module.exports = config;
