"use client";

import { Button } from "@heroui/react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { PropsWithChildren } from "react";

type SortItem = {
  field: string;
  direction: "asc" | "desc";
};

export function SortButton<T extends SortItem>({
  field,
  sort,
  onSort,
  children,
}: PropsWithChildren<{
  field: T["field"];
  sort: T;
  onSort: (field: T["field"]) => void;
}>) {
  const isActive = sort.field === field;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-inherit w-full! text-xs hover:bg-transparent"
      onPress={() => onSort(field)}
    >
      {children}
      {isActive ? (
        sort.direction === "asc" ? (
          <ArrowUp className="text-accent size-3.5" />
        ) : (
          <ArrowDown className="text-accent size-3.5" />
        )
      ) : (
        <ChevronsUpDown className="text-muted size-3.5" />
      )}
    </Button>
  );
}
