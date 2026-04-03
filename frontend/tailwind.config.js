/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ye line ensure karti hai ki sub-folders (pages/components) scan ho jayein
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}