"use client";

import type { Resource } from "@/models/types";
import { CreateButton } from "./CreateButton";

export function TableEmptyState({ resource }: { resource: Resource }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <span className="text-lg">No Data</span>
      <CreateButton resource={resource} collapsible={false} />
    </div>
  );
}
