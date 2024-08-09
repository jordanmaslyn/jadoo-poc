import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  base: '/jadoo-poc/',
  plugins: [],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});