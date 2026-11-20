/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: '#0f2744',
          blue: '#1e3a8a',
          teal: '#0d9488',
          emerald: '#059669',
          light: '#f8fafc',
          border: '#e2e8f0',
          dark: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
