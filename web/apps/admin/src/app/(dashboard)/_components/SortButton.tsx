"use client";

import type { Sort } from "@/models/types";
import { Button } from "@heroui/react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { PropsWithChildren } from "react";

export function SortButton({
  field,
  sort,
  onSort,
  children,
}: PropsWithChildren<{
  field: Sort["field"];
  sort: Sort;
  onSort: (field: Sort["field"]) => void;
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
