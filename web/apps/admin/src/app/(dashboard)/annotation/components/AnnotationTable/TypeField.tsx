"use client";

import type { AnnotationType } from "@/models/types";
import { Tooltip } from "@heroui/react";
import { TypeIcon } from "./TypeIcon";

export function TypeField({ type }: { type: AnnotationType }) {
  return (
    <Tooltip delay={300}>
      <Tooltip.Trigger role="img" aria-label={type} className="inline-flex">
        <TypeIcon type={type} />
      </Tooltip.Trigger>
      <Tooltip.Content>{type}</Tooltip.Content>
    </Tooltip>
  );
}
