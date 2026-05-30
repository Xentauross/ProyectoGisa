/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            {
                temaGisa: {
                    "primary": "#0d9488",
                    "primary-focus": "#0f766e",
                    "primary-content": "#ffffff",
                    "secondary": "#14b8a6",
                    "secondary-content": "#ffffff",
                    "accent": "#5eead4",
                    "accent-content": "#0f172a",

                    "neutral": "#e2e8f0",
                    "neutral-content": "#0f172a",

                    "base-100": "#d5e9e3",      // Fondo general
                    "base-200": "#ffffff",       // Tarjetas
                    "base-300": "#0f172a",       // Navbar (slate oscuro)
                    "base-400": "#1c212e",       // Navbar (slate oscuro)
                    "base-content": "#334155",   // Texto general

                    "info": "#3b82f6",
                    "success": "#10b981",
                    "warning": "#f59e0b",
                    "error": "#ef4444",
                },
            },
        ],
    },
};