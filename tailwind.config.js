/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'Amiri', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Cairo', 'Inter', 'sans-serif']
      },
      colors: {
        saudi: {
          50: '#f0fdf4',
          100: '#dcfce7', 
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main Saudi green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d', 
          400: '#fbbf24',
          500: '#f59e0b', // Saudi gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        desert: {
          50: '#faf5f0',
          100: '#f4e6d5',
          200: '#e9ccab',
          300: '#ddb180',
          400: '#d19755',
          500: '#c47d2a',
          600: '#9d6421',
          700: '#764b19',
          800: '#4f3210',
          900: '#281908'
        }
      },
      screens: {
        'xs': '375px',
        'touch': {'raw': '(pointer: coarse)'}
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'blob': 'blob 7s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },
      backdropBlur: {
        'xs': '2px'
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities, theme, addBase }) {
      // Add RTL utilities
      const rtlUtilities = {
        '.rtl': {
          direction: 'rtl'
        },
        '.ltr': {
          direction: 'ltr'
        },
        // RTL-aware margin and padding
        '.ms-auto': {
          'margin-inline-start': 'auto'
        },
        '.me-auto': {
          'margin-inline-end': 'auto'
        },
        '.ps-4': {
          'padding-inline-start': theme('spacing.4')
        },
        '.pe-4': {
          'padding-inline-end': theme('spacing.4')
        },
        '.border-s': {
          'border-inline-start-width': '1px'
        },
        '.border-e': {
          'border-inline-end-width': '1px'
        },
        // Touch-friendly sizes
        '.touch-target': {
          'min-width': '44px',
          'min-height': '44px'
        }
      };

      addUtilities(rtlUtilities);

      // Add Arabic font loading optimization
      addBase({
        '@font-face': [
          {
            fontFamily: 'Cairo',
            fontStyle: 'normal',
            fontWeight: '300 700',
            fontDisplay: 'swap',
            src: 'url("https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap")'
          },
          {
            fontFamily: 'Inter',
            fontStyle: 'normal', 
            fontWeight: '300 700',
            fontDisplay: 'swap',
            src: 'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap")'
          }
        ]
      });
    }
  ]
};