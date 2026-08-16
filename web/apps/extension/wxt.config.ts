import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    web_accessible_resources: [
      {
        resources: ["content-ui.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
});
