module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#AFFF33',
          '50': '#F4FFEB',
          '100': '#E9FFD6',
          '200': '#D9FFB8',
          '300': '#C8FF99',
          '400': '#B8FF7A',
          '500': '#AFFF33',
          '600': '#8CCF1F',
          '700': '#699C17',
          '800': '#46690F',
          '900': '#233607'
        },
        gray: {
          '900': '#121212',
          '800': '#1E1E1E',
          '700': '#282828',
          '400': '#9CA3AF',
          '300': '#D1D5DB',
        }
      }
    },
  },
  plugins: [],
}
