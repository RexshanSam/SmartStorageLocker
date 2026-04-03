/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#b9caff',
          300: '#91aae8',
          400: '#6c7fde',
          500: '#5666de',
          600: '#3b4fce',
          700: '#303fac',
          800: '#2a38a0',
          900: '#233186',
          950: '#0f172a', // deep navy (background)
        },
        electric: {
          blue: '#3b82f6',
        },
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
