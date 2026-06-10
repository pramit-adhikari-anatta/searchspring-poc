/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			lexend: ['Lexend', 'system-ui', 'sans-serif'],
			moret: ['moret', 'serif'],
			sans: ['Lexend', 'system-ui', 'sans-serif'],
		},
		fontSize: {
			xs: '.75rem',
			sm: '.875rem',
			base: '1rem',
			lg: '1.25rem',
			xl: '1.5rem',
			'2xl': '1.75rem',
			'3xl': '2.25rem',
			'4xl': '2.5rem',
			'5xl': '4rem',
		},
		extend: {
			colors: {
				primary: '#d53e27',
				'primary-dark': '#aa0017',
				'primary-darker': '#660013',
				'primary-content': '#ffffff',
				secondary: '#0076d8',
				'secondary-dark': '#006bbb',
				'secondary-content': '#ffffff',
				tertiary: '#97ead2',
				'tertiary-content': '#2f3337',
				accent: '#fabc3c',
				'v2-off-white': '#faf9f6',
				'v2-brown': '#5c4b3b',
				'v2-brown-darker': '#3b2f23',
			},
		},
	},
	plugins: [],
};
