/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.25rem',
				lg: '2rem',
				xl: '2.5rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1440px',
			},
		},
		extend: {
			colors: {
				primary: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					DEFAULT: '#059669',
				},
				secondary: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#f59e0b',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
					DEFAULT: '#f59e0b',
				},
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#ea580c',
					600: '#c2410c',
					700: '#9a3412',
					800: '#7c2d12',
					900: '#5a1d0e',
					DEFAULT: '#c47d2a',
				},
			},
			boxShadow: {
				soft: '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
				'soft-lg': '0 10px 30px rgba(0,0,0,0.12)',
				glow: '0 0 20px rgba(16, 185, 129, 0.35)',
				'glow-gold': '0 0 20px rgba(245, 158, 11, 0.35)',
			},
			keyframes: {
				blob: {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(20px, -20px) scale(1.05)' },
					'66%': { transform: 'translate(-10px, 10px) scale(0.98)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				blob: 'blob 7s infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out both',
			},
		},
		fontFamily: {
			sans: [
				'Inter',
				'system-ui',
				'-apple-system',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
			],
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		function ({ addUtilities }) {
			const delays = {
				'.animation-delay-200': { 'animation-delay': '200ms' },
				'.animation-delay-400': { 'animation-delay': '400ms' },
				'.animation-delay-600': { 'animation-delay': '600ms' },
				'.animation-delay-800': { 'animation-delay': '800ms' },
				'.animation-delay-2000': { 'animation-delay': '2000ms' },
				'.animation-delay-4000': { 'animation-delay': '4000ms' },
			};
			addUtilities(delays, ['responsive']);
		},
	],
};

