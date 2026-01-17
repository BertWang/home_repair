/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                'stone-paper': '#F9F8F6',
                'stone-dark': '#2C2C2C',
                'stone-light': '#888888',
                'wood-accent': '#B3A08D',
            },
            fontFamily: {
                sans: ['"Noto Sans TC"', '"Manrope"', 'sans-serif'],
                mono: ['"Manrope"', 'monospace'],
            },
            letterSpacing: {
                tighter: '-0.05em',
                widest: '0.15em',
            },
        },
    },
    plugins: [],
}
