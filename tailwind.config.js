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
          dark: '#141414',
          darklight: '#1E1E1E',
        }
      },
    },
  },
  plugins: [],
}
