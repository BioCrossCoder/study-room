import { useSyncExternalStore } from "react";

let status: [boolean, boolean] = [false, false];

function getStatus(): [boolean, boolean] {
  const canGoBack = navigation.canGoBack;
  const canGoForward = navigation.canGoForward;
  if (status[0] !== canGoBack || status[1] !== canGoForward) {
    status = [canGoBack, canGoForward];
  }
  return status;
}

function subscribe(onStoreChange: () => void) {
  let queued = false;
  const notify = () => {
    if (queued) {
      return;
    }
    queued = true;
    queueMicrotask(() => {
      queued = false;
      onStoreChange();
    });
  };
  navigation.addEventListener("currententrychange", notify);
  navigation.addEventListener("navigate", notify);
  return () => {
    navigation.removeEventListener("currententrychange", notify);
    navigation.removeEventListener("navigate", notify);
  };
}

export function useAppHistory() {
  const [canGoBack, canGoForward] = useSyncExternalStore(
    subscribe,
    getStatus,
    () => status,
  );
  return {
    canGoBack,
    back: () => navigation.back(),
    canGoForward,
    forward: () => navigation.forward(),
  };
}
