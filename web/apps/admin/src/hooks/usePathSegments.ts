"use client";

import { usePathname } from "next/navigation";

export function usePathSegments() {
  const pathname = usePathname();
  return pathname.split("/").slice(1);
}
