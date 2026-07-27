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
    "bg-orange-600",
    "text-blue-600",
    "text-emerald-600",
    "bg-emerald-100",
    "bg-red-100",
    "text-red-700",
    "bg-green-100",
    "text-green-700",
    "bg-yellow-100",
    "text-yellow-700",
    "bg-blue-100",
    "text-blue-700",
    "text-emerald-700"

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}