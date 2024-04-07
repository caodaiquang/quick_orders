/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'btn_1': '#114232',
        'btn_2': '#87A922',
        'btn_3': '#FCDC2A',
        'btn_5': '#6420AA',
        'btn_6': '#59D5E0',
      },
    },
  },
  plugins: [],
}