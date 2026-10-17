"use client";

import type { library } from "@/models/orm";
import { useState } from "react";
import { LibraryDetailsCard } from "./LibraryDetailsCard";
import { LibraryUpdateForm } from "./LibraryUpdateForm";

export function LibraryCard({ item }: { item: typeof library.$inferSelect }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <LibraryUpdateForm
      item={item}
      onDiscard={() => setEditing(false)}
      onSaved={() => setEditing(false)}
    />
  ) : (
    <LibraryDetailsCard item={item} onEdit={() => setEditing(true)} />
  );
}
