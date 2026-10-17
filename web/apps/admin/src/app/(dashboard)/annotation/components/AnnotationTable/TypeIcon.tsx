"use client";

import type { AnnotationType } from "@/models/types";
import type { LucideIcon } from "lucide-react";
import { ArrowLeftRight, MessageSquareText, Minus, Plus } from "lucide-react";

const TYPE_ICONS = {
  replace: ArrowLeftRight,
  append: Plus,
  remove: Minus,
  explain: MessageSquareText,
} satisfies Record<AnnotationType, LucideIcon>;

export function TypeIcon({ type }: { type: AnnotationType }) {
  const Icon = TYPE_ICONS[type];
  return <Icon aria-hidden className="size-4" />;
}
