/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E6FAF7',
          100: '#C0F2EB',
          200: '#80E5D7',
          300: '#40D8C3',
          400: '#00CBAF',
          500: '#00B89F',
          600: '#009E88',
          700: '#007D6B',
          800: '#005C4F',
          900: '#003B32',
        },
        navy: {
          50:  '#EEF2F8',
          100: '#D5DDE9',
          200: '#AAB9D3',
          300: '#8096BC',
          400: '#5672A5',
          500: '#2C4E8F',
          600: '#1E3A72',
          700: '#142B5A',
          800: '#0A1C3D',
          900: '#060E1E',
        },
        surface: '#F0F4FA',
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(10,28,61,.06), 0 4px 12px rgba(10,28,61,.05)',
        'card-lg': '0 4px 16px rgba(10,28,61,.10), 0 1px 4px rgba(10,28,61,.06)',
        'brand':   '0 4px 18px rgba(0,184,159,.35)',
        'float':   '0 8px 32px rgba(10,28,61,.14), 0 2px 8px rgba(10,28,61,.08)',
      },
    },
  },
  plugins: [],
};
