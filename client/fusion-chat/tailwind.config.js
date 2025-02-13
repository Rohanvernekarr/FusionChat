module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#2f2f2f',
        Black: '#000000', 
        White: '#fcfcfc',
        richblack: "#04151f",
        Night: "#011502",
        space: "#111D4A",
        charcoal: "#3A4454",
        payngray: "53687e",
        jet: "3a3238"
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'spin-slower': 'spin 20s linear infinite reverse',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
