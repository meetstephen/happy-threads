/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFAF6',
          100: '#FAF6F1',
          200: '#F2EAD9',
          300: '#E8D9BF',
        },
        ink: {
          900: '#14110E',
          800: '#1B1A17',
          700: '#3A352F',
        },
        bronze: {
          400: '#D4A574',
          500: '#B07A4C',
          600: '#8E5E37',
        },
        wine: {
          500: '#8B2942',
          600: '#6E1F33',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 30px 60px -20px rgba(20, 17, 14, 0.25)',
        soft: '0 10px 30px -10px rgba(20, 17, 14, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
