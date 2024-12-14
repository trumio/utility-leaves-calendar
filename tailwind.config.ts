/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        white: {
          DEFAULT: '#FFFFFF',
          creamy: '#FAFAFA',
        },
      },
      boxShadow: {
        card: '0px 4px 24px 0px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
