/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        novelize: {
          primary: '#3138B0',
          primarylight: '#5966C9',
          dark: '#141414',
          darklight: '#1E1E1E',
        }
      },
      backgroundImage: {
        'darklayer': 'radial-gradient(circle, rgba(113, 115, 118, 0), rgba(87, 88, 90, 0.1), rgba(61, 61, 63, 0.4), #252526, #0d0d0d)',
      }
    },
  },
  plugins: [],
}
