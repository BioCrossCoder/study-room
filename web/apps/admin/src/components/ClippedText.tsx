"use client";

import { Tooltip } from "@heroui/react";

export function ClippedText({ children }: { children: string }) {
  return (
    <Tooltip delay={300}>
      <Tooltip.Trigger
        role="presentation"
        tabIndex={-1}
        className="block truncate"
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content>{children}</Tooltip.Content>
    </Tooltip>
  );
}
