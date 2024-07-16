/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-purple": "linear-gradient(135deg, #503F76 100%, #5E4EA4 80%)",
      },
      colors:{
        'primary-purple': '#503F76',
        'primary-blue': '#6C5DD2',
        'primary-orange': '#FF9F24',
        'primary-cream': '#FFCDB5',
        'primary-white' : "#F6E8DF"
      }
    },
  },
  plugins: [],
};
