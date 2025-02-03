/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '2': '0.5rem',
        '8': '2rem',
      },
      zIndex: {
        '50': '50',
      }
    },
  },
  plugins: [],
}
