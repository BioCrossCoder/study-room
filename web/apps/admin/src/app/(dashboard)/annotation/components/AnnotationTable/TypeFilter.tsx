"use client";

import type { AnnotationType } from "@/models/types";
import { EnumMultiFilter } from "@/components/EnumMultiFilter";
import { annotationTypes } from "@/models/enums";
import { TypeIcon } from "./TypeIcon";

export function TypeFilter({
  value,
  onApply,
}: {
  value: readonly string[];
  onApply: (types: readonly string[]) => void;
}) {
  return (
    <EnumMultiFilter
      label="Type"
      options={annotationTypes}
      value={value}
      renderOption={(type) => <TypeIcon type={type as AnnotationType} />}
      onApply={onApply}
    />
  );
}
