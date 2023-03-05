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
    },
  },
  plugins: [],
}
