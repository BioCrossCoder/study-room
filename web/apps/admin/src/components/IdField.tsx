import type { PropsWithChildren } from "react";

export function IdField({ children }: PropsWithChildren) {
  return <span className="text-muted wrap-break-word">{children}</span>;
}
