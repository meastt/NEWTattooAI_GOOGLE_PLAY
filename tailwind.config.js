/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Bebas Neue', 'Oswald', 'system-ui', 'sans-serif'],
                'heading': ['Oswald', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Onyx - Deep, rich blacks for premium background
                'onyx': {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#050505', // Main background
                },
                // Cyber-Blue - Sharp, high-contrast accent
                'electric': {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#00d4ff', // Primary Brand Color
                    600: '#00b8db',
                    700: '#0891b2',
                    800: '#0e7490',
                    900: '#155e75',
                    950: '#083344',
                },
                // Steel - Cool grays for text and borders
                'steel': {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // Legacy colors mapped to new palette for backward compatibility
                'void': {
                    950: '#050505',
                    900: '#121212',
                    800: '#1E1E1E',
                    700: '#2A2A2A',
                },
                'magenta': {
                    400: '#00d4ff', // Map magenta to electric blue for unified look
                    500: '#00d4ff',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
