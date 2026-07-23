/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  // Disable Tailwind's Preflight reset so it does NOT overwrite MUI's
  // component styles (which rely heavily on its own baseline reset).
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
