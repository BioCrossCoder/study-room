"use client";

import type { library } from "@/models/orm";
import { useState } from "react";
import { LibraryDetailsCard } from "./LibraryDetailsCard";
import { LibraryForm } from "./LibraryForm";

export function LibraryCard({ item }: { item: typeof library.$inferSelect }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <LibraryForm
      item={item}
      onDiscard={() => setEditing(false)}
      onSaved={() => setEditing(false)}
    />
  ) : (
    <LibraryDetailsCard item={item} onEdit={() => setEditing(true)} />
  );
}
