import { safeParseJsonArray } from "@/common/filter";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from "@/common/list";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SortItem = { field: string; direction: "asc" | "desc" };

export function useListQuery<T extends SortItem>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = safeParseJsonArray(searchParams.get("filter"));
  const base = (filters[0] ?? {}) as Record<string, unknown>;
  const sort = JSON.parse(searchParams.get("sort") ?? "[]") as T[];
  const primary = sort[0] ?? (DEFAULT_SORT as T);
  const page = Number.parseInt(searchParams.get("page") ?? DEFAULT_PAGE, 10);
  const size = Number.parseInt(
    searchParams.get("size") ?? DEFAULT_PAGE_SIZE,
    10,
  );

  const navigate = (
    mutate: (query: URLSearchParams) => void,
    resetPage: boolean,
  ) => {
    const query = new URLSearchParams(searchParams);
    mutate(query);
    if (resetPage) {
      query.set("page", "1");
    }
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  const applyFilter = (next: Record<string, unknown>[]) => {
    navigate((query) => query.set("filter", JSON.stringify(next)), true);
  };

  const toggleSort = (field: T["field"]) => {
    navigate(
      (query) =>
        query.set(
          "sort",
          JSON.stringify([
            {
              field,
              direction:
                primary.field === field && primary.direction === "desc"
                  ? "asc"
                  : "desc",
            },
            { field: "id", direction: "desc" },
          ]),
        ),
      true,
    );
  };

  const goToPage = (nextPage: number, nextSize: number = size) => {
    navigate((query) => {
      query.set("page", String(nextPage));
      query.set("size", String(nextSize));
    }, false);
  };

  return {
    filters,
    base,
    primary,
    isPending,
    page,
    size,
    applyFilter,
    toggleSort,
    goToPage,
  };
}
