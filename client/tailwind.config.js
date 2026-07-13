/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-red-600",
    "text-green-600",
    "text-yellow-600",
    "bg-blue-600",
    "text-sky-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-teal-600",
    "bg-red-600",
    "bg-orange-500",
    "bg-teal-500",
    "bg-lime-600",
    "bg-sky-600",
    "bg-rose-600",
    "bg-orange-600"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}