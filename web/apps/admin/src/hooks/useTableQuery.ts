import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SortItem = { field: string; direction: "asc" | "desc" };

const DEFAULT_SORT: SortItem = { field: "createAt", direction: "desc" };

export function useTableQuery<T extends SortItem>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const sort = JSON.parse(searchParams.get("sort") ?? "[]") as T[];
  const primary = (sort[0] ?? DEFAULT_SORT) as T;

  const apply = (params: Record<string, string>) => {
    const query = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      query.set(key, value);
    }
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  const toggleSort = (field: T["field"]) => {
    apply({
      sort: JSON.stringify([
        {
          field,
          direction:
            primary.field === field && primary.direction === "desc"
              ? "asc"
              : "desc",
        },
        { field: "id", direction: "desc" },
      ]),
    });
  };

  return { primary, toggleSort, isPending, apply, searchParams };
}
