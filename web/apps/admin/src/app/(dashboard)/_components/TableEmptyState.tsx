"use client";

import type { PropsWithChildren } from "react";

export function TableEmptyState({ children }: PropsWithChildren) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <span className="text-lg">No Data</span>
      {children}
    </div>
  );
}
