/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Text', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
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
          950: '#022c22',
        },
        system: {
          blue: 'var(--system-blue)',
          green: 'var(--system-green)',
          indigo: 'var(--system-indigo)',
          orange: 'var(--system-orange)',
          pink: 'var(--system-pink)',
          purple: 'var(--system-purple)',
          red: 'var(--system-red)',
          teal: 'var(--system-teal)',
          yellow: 'var(--system-yellow)',
          gray: 'var(--system-gray)',
        },
      },
      animation: {
        'ios-spring': 'ios-spring 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'ios-spring': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};