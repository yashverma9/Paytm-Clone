/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "bd-gray": "#7E7F7E",
                "pay-gray-bg": "#F3F4F6",
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            fontSize: {
                "number-large": "32px",
                15: "15px",
                13: "13px",
            },
            flexBasis: {
                "1/7": "14.28%",
                "1/8": "12.5%",
            },
        },
    },
    plugins: [],
};
