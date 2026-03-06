// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mariehardingcounselling.ie",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
});
