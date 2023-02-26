/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#a855f7',
        secondary: '#f7a855',
        tertiary: '#ec4899',
        text_color: '#1f2937',
      },
    },
    fontFamily: {
      sans: ['DM Sans', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
}
