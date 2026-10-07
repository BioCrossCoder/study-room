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

export function wrapError(e: unknown) {
  return Error.isError(e) ? e : new Error(String(e));
}

export const FALLBACK_TIME_ZONE = "UTC";
export const FALLBACK_TIME_ZONE_LABEL = "UTC";

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  kind: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  const key = `${kind}|${timeZone}`;
  const cached = formatters.get(key);
  if (cached) {
    return cached;
  }
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-US", { ...options, timeZone });
  } catch {
    formatter = new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: FALLBACK_TIME_ZONE,
    });
  }
  formatters.set(key, formatter);
  return formatter;
}

export function resolveTimeZone() {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      new Intl.DateTimeFormat("en-US", { timeZone });
      return timeZone;
    }
  } catch {}
  return FALLBACK_TIME_ZONE;
}

export function formatTimeZoneLabel(date: Date, timeZone?: string) {
  const zone = timeZone ?? FALLBACK_TIME_ZONE;
  const parts = getFormatter("offset", zone, {
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const label = parts.find((part) => part.type === "timeZoneName")?.value;
  return !label || label === "GMT+0" ? FALLBACK_TIME_ZONE_LABEL : label;
}

export function formatDateTime(
  date: Date | null | undefined,
  timeZone?: string,
) {
  if (!date) {
    return "-";
  }
  const zone = timeZone ?? FALLBACK_TIME_ZONE;
  const text = getFormatter("dateTime", zone, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
  return `${text} ${formatTimeZoneLabel(date, zone)}`;
}
