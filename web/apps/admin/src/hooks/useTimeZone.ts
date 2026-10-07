"use client";

import { FALLBACK_TIME_ZONE, resolveTimeZone } from "common";
import { useSyncExternalStore } from "react";

export function useTimeZone() {
  return useSyncExternalStore(
    () => () => {},
    resolveTimeZone,
    () => FALLBACK_TIME_ZONE,
  );
}
