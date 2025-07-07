/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d9ff',
          300: '#a4beff',
          400: '#7d99ff',
          500: '#5c6cf7',
          600: '#4147ee',
          700: '#3238d4',
          800: '#2c31ab',
          900: '#2a2e88',
          950: '#1a1b50',
        },
        secondary: {
          50: '#f6f8fd',
          100: '#edf1fc',
          200: '#d9e2f8',
          300: '#bacbf2',
          400: '#95acea',
          500: '#758ce0',
          600: '#5e6fd3',
          700: '#4c5cc0',
          800: '#424d9d',
          900: '#38437d',
          950: '#252a4d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}