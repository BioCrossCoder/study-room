"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getMediaQuery } from "@/common/media";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = getMediaQuery(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => getMediaQuery(query).matches,
    [query],
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
