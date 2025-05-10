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