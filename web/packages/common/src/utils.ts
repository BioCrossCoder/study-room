import { WindowMessageType } from "./enums";
import type { WindowMessageData } from "./types";

export function createWindowMessage<T extends WindowMessageType>(
  target: Window,
  type: T,
) {
  const send = (data: WindowMessageData[T]) => {
    target.postMessage(
      {
        type,
        data,
      },
      "*",
    );
  };
  const listen = (handler: (data: WindowMessageData[T]) => void) => {
    const callback = (event: MessageEvent) => {
      if (event.data?.type === type) {
        handler(event.data.data);
      }
    };
    target.addEventListener("message", callback);
    return () => window.removeEventListener("message", callback);
  };
  return { send, listen } as const;
}

export function triggerAutoSize(container: Window) {
  const { send } = createWindowMessage(
    container,
    WindowMessageType.ContentResize,
  );
  const observer = new ResizeObserver(() => {
    send({
      height: document.body.scrollHeight,
      width: document.body.scrollWidth,
    });
  });
  observer.observe(document.documentElement);
}

export function executeAutoSize(
  container: HTMLIFrameElement,
  callback?: (data: WindowMessageData[WindowMessageType.ContentResize]) => void,
) {
  const { listen } = createWindowMessage(
    window,
    WindowMessageType.ContentResize,
  );
  return listen((data) => {
    const { height, width } = data;
    container.style.height = height + "px";
    container.style.width = width + "px";
    if (callback) {
      callback(data);
    }
  });
}
