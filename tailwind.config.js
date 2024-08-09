/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.html"],
    theme: {
        container: {
            center: true,
            screens: {
                sm: '600px',
                md: '728px',
                lg: '984px',
                xl: '1180px',
            },
            padding: '1rem'
        },
        fontFamily: {
            display: ['Volkhov', 'serif'],
            body: ['Poppins', 'sans-serif']
        },
        extend: {
            colors: {
                text: {
                    dark: "#14183E",
                    DEFAULT: '#212832',
                    light: '#5E6282',
                },
                primary: {
                    '50': '#fffcea',
                    '100': '#fff7c5',
                    '200': '#fff086',
                    '300': '#ffe146',
                    '400': '#ffd01c',
                    DEFAULT: '#f1a501',
                    '500': '#f1a501',
                    '600': '#e18400',
                    '700': '#bb5c02',
                    '800': '#974709',
                    '900': '#7c3a0b',
                    '950': '#481d00',
                },
                secondary: {
                    '50': '#fdf5f3',
                    '100': '#fbe9e5',
                    '200': '#f9d6cf',
                    '300': '#f4b9ad',
                    '400': '#ec907d',
                    DEFAULT: '#df6951',
                    '500': '#df6951',
                    '600': '#cb5037',
                    '700': '#ab402a',
                    '800': '#8e3826',
                    '900': '#763426',
                    '950': '#40170f',
                },
            }
        }
    },
    plugins: [],
}