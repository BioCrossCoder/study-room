"use client";

import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";

export function DateField({ value }: { value: Date | null | undefined }) {
  const timeZone = useTimeZone();
  return <>{formatDateTime(value, timeZone)}</>;
}
