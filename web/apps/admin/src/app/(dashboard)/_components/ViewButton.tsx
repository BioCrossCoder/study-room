"use client";

import type { Resource } from "@/models/types";
import { Button } from "@heroui/react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export function ViewButton({
  resource,
  id,
}: {
  resource: Resource;
  id: string;
}) {
  const router = useRouter();
  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      className="bg-surface-secondary hover:bg-surface-tertiary"
      aria-label="View details"
      onPress={() => router.push(`/${resource}/${id}`)}
    >
      <Eye />
    </Button>
  );
}
