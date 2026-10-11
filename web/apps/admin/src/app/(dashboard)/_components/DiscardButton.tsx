"use client";

import { Button } from "@heroui/react";
import { X } from "lucide-react";

export function DiscardButton({ onDiscard }: { onDiscard: () => void }) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      className="bg-danger-soft text-danger hover:bg-danger-soft-hover"
      aria-label="Discard changes"
      onPress={onDiscard}
    >
      <X />
    </Button>
  );
}
