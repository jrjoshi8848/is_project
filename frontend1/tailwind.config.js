// tailwind.config.js
import daisyui from 'daisyui';
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,       // Add DaisyUI plugin
    forms,         // Add Tailwind CSS Forms plugin
  ],
};