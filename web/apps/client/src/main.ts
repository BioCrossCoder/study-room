import { executeAutoSize } from "common";
import panelHtml from "./panel/dist/index.html?raw";
import popupHtml from "./popup/dist/index.html?raw";
import "tailwindcss/index.css";

function createOverlayBlock(srcdoc: string) {
  const container = document.createElement("div");
  container.classList.add("fixed", "z-[9999]");
  document.body.appendChild(container);
  const iframe = document.createElement("iframe");
  iframe.srcdoc = srcdoc;
  iframe.classList.add("border-0");
  container.appendChild(iframe);
  executeAutoSize(iframe);
  return { container, iframe };
}

(() => {
  const { container: panelContainer, iframe: panelIframe } =
    createOverlayBlock(panelHtml);
  panelContainer.classList.add(
    "portrait:bottom-0",
    "portrait:w-screen",
    "landscape:right-0",
    "landscape:top-0",
    "landscape:h-screen",
  );

  const { container: popupContainer, iframe: popupIframe } =
    createOverlayBlock(popupHtml);
  popupContainer.classList.add("flex", "justify-center", "w-screen", "top-0");
})();
