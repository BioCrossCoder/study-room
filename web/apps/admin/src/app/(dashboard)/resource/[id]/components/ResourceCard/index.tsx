"use client";

import { useState } from "react";
import { ResourceDetailsCard } from "./ResourceDetailsCard";
import { ResourceUpdateForm } from "./ResourceUpdateForm";
import type { ResourceDetail } from "./types";

export function ResourceCard({ item }: { item: ResourceDetail }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <ResourceUpdateForm
      item={item}
      onDiscard={() => setEditing(false)}
      onSaved={() => setEditing(false)}
    />
  ) : (
    <ResourceDetailsCard item={item} onEdit={() => setEditing(true)} />
  );
}
