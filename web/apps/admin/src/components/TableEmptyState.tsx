import type { PropsWithChildren } from "react";

export function TableEmptyState({
  overlay,
  children,
}: PropsWithChildren<{ overlay?: boolean }>) {
  const body = (
    <div className="h-full min-h-40 flex flex-col items-center justify-center gap-3">
      <span className="text-lg">No Data</span>
      {children}
    </div>
  );

  return overlay ? (
    <div className="absolute inset-0 bg-background-tertiary dark:bg-surface-secondary">
      {body}
    </div>
  ) : (
    body
  );
}
