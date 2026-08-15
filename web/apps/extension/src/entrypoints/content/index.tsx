import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/style.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "study-room-extension-ui",
      position: "overlay",
      anchor: "body",
      mode: "closed",
      onMount(container) {
        const app = document.createElement("div");
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(
          <React.StrictMode>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </React.StrictMode>,
        );
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });
    ui.mount();
  },
});
