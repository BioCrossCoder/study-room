import { executeAutoSize } from "common";

export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx) {
    const cancelers = new Array<() => unknown>();
    const ui = createIframeUi(ctx, {
      page: "/content-ui.html",
      position: "overlay",
      anchor: "body",
      onMount(wrapper, iframe) {
        wrapper.style.position = "fixed";
        wrapper.style.bottom = "0";
        wrapper.style.zIndex = "9999";
        wrapper.style.width = "100vw";
        wrapper.style.display = "flex";
        iframe.style.position = "";
        wrapper.style.justifyContent = "center";
        iframe.style.border = "none";
        const cancel = executeAutoSize(iframe, ({ height }) => {
          wrapper.style.bottom = height + "px";
        });
        cancelers.push(cancel);
      },
      onRemove() {
        cancelers.forEach((f) => f());
      },
    });
    ui.mount();
  },
});
