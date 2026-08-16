import { createWindowMessage, WindowMessageType } from "common";

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
        wrapper.style.bottom = "1px";
        wrapper.style.left = "50%";
        wrapper.style.transform = "translateX(-50%)";
        wrapper.style.zIndex = "9999";
        iframe.style.border = "none";
        const { listen } = createWindowMessage(
          window,
          WindowMessageType.ContentResize,
        );
        const cancel = listen(({ height, width }) => {
          iframe.style.height = height + "px";
          iframe.style.width = width + "px";
          wrapper.style.bottom = height + "px";
          wrapper.style.left = `calc(50vw - ${width / 2}px)`;
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
