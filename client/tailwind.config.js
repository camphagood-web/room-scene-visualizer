/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#d97706', // amber-600
                    hover: '#b45309', // amber-700
                    ...require('tailwindcss/colors').amber
                },
                secondary: {
                    light: '#cffafe', // cyan-100
                    dark: '#155e75', // cyan-800
                    ...require('tailwindcss/colors').cyan
                },
                neutral: require('tailwindcss/colors').stone,
            },
            fontFamily: {
                heading: ['"DM Sans"', 'sans-serif'],
                body: ['"DM Sans"', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
            }
        },
    },
    plugins: [],
}
