/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#F4D03F',
                secondary: '#2E86C1',
            }
        },
    },
    plugins: [],
}
