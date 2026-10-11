"use client";

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { COMPACT_MEDIA } from "@/common/media";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Resource } from "@/models/types";

export function CreateButton({
  resource,
  collapsible = true,
}: {
  resource: Resource;
  collapsible?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const isCompact = useMediaQuery(COMPACT_MEDIA);
  const iconOnly = collapsible && isCompact;
  const label = resource[0].toUpperCase() + resource.slice(1);

  return (
    <Button
      variant="primary"
      className="shrink-0"
      isIconOnly={iconOnly}
      aria-label={`New ${label}`}
      onPress={() => startTransition(() => router.push(`/${resource}/new`))}
    >
      {iconOnly ? <Plus /> : `New ${label}`}
    </Button>
  );
}
