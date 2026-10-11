/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        hackerBg: '#0d0d0d',
        hackerBorder: '#333333',
        hackerText: '#e0e0e0',
      }
    },
  },
  plugins: [],
}