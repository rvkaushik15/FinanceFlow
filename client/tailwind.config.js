/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Capitalist Palette
                gold: {
                    50: '#FBF7E6',
                    100: '#F5EBC0',
                    200: '#EBD683',
                    300: '#D4AF37', // Classic Bullion Gold
                    400: '#C59D24',
                    500: '#B8860B', // Dark Goldenrod (Rich Wealth)
                    600: '#996515', // Golden Brown
                    700: '#754C0F',
                    800: '#54360A',
                    900: '#362306',
                },
                silver: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                // Money Green
                money: {
                    DEFAULT: '#118C4F', // US Dollar Green
                    light: '#85bb65',   // Light Bill Green
                    dark: '#0e5e34'     // Deep Bank Green
                },
                // Rich Black/Dark variations for background
                dark: {
                    bg: '#050505',      // Almost black
                    card: '#0A0A0A',    // Very dark gray
                    surface: '#121212', // Material Dark
                    border: '#2A2A2A'
                },
                primary: {
                    DEFAULT: '#B8860B', // Rich Gold as primary
                    50: '#FBF7E6',
                    100: '#F5EBC0',
                    200: '#EBD683',
                    300: '#D4AF37',
                    400: '#C59D24',
                    500: '#B8860B',
                    600: '#996515',
                    700: '#754C0F',
                    900: '#362306',
                }
            },
            boxShadow: {
                'glass': '0 8px 30px rgb(0 0 0 / 0.04)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Playfair Display', 'serif'], // Elegant serif for headings
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px #D4AF37, 0 0 10px #D4AF37' },
                    '100%': { boxShadow: '0 0 20px #D4AF37, 0 0 30px #D4AF37' }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'metal-sheen': 'linear-gradient(45deg, #bfbfbf 0%, #dedede 25%, #ffffff 50%, #dedede 75%, #bfbfbf 100%)',
                'gold-sheen': 'linear-gradient(45deg, #DDB852 0%, #F9F1D8 25%, #FFD700 50%, #F9F1D8 75%, #DDB852 100%)',
            }
        },
    },
    plugins: [],
}
