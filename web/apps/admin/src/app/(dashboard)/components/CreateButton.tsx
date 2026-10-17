"use client";

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Resource } from "@/models/types";

export function CreateButton({ resource }: { resource: Resource }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const label = resource[0].toUpperCase() + resource.slice(1);

  return (
    <Button
      variant="primary"
      className="size-9 shrink-0 @3xl:w-auto @3xl:px-4"
      isIconOnly
      aria-label={`New ${label}`}
      onPress={() => startTransition(() => router.push(`/${resource}/new`))}
    >
      <Plus className="@3xl:hidden" />
      <span className="hidden @3xl:inline">New</span>
    </Button>
  );
}
