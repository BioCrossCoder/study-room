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
