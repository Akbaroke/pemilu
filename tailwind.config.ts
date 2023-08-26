import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        one: '#222121',
        two: '#F0F0F0',
        three: '#C6C6C6',
        success: '#34A853',
        danger: '#CA3030',
      },
    },
  },
  plugins: [],
};
export default config;
