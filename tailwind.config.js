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
          primarydark: '#181823',
          primarylight: '#5966C9',
          secondary: '#FFA500',
          dark: '#141414',
          darklight: '#1E1E1E',
        }
      },
      backgroundImage: {
        'darklayer': 'linear-gradient(43.95deg, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0.8) 30%, rgba(20, 20, 20, 0.1) 64.9%)',
      }
    },
  },
  plugins: [],
}
