"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function usePaginationNav(count: number) {
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const size = Number.parseInt(searchParams.get("size") ?? "20", 10);
  const total = Math.ceil(count / size);
  const current = Math.min(page, total);
  const pages = useMemo(() => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }
    const visible = [...new Set([1, current - 1, current, current + 1, total])]
      .filter((item) => item >= 1 && item <= total)
      .sort((a, b) => a - b);
    return visible.flatMap((item, index) => {
      const previous = visible[index - 1];
      return index > 0 && item - previous > 1
        ? (["...", item] as const)
        : [item];
    });
  }, [current, total]);

  const pathname = usePathname();
  const router = useRouter();
  const go = useCallback(
    (targetPage: number, targetSize: number = size) => {
      const query = new URLSearchParams(searchParams);
      query.set("page", String(targetPage));
      query.set("size", String(targetSize));
      router.push(`${pathname}?${query.toString()}`);
    },
    [pathname, router, searchParams, size],
  );

  return { page: current, size, count, total, pages, go };
}
