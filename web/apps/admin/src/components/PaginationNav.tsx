"use client";

import { useListQuery } from "@/hooks/useListQuery";
import { Button, Pagination } from "@heroui/react";

const sizeOptions = [10, 20, 50, 100] as const;

const PAGE_ITEM = "w-auto h-7 min-w-7 px-1.5";
const NAV_ITEM = "w-auto h-7 min-w-7";

function buildPageItems(current: number, total: number) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const visible = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((item) => item >= 1 && item <= total)
    .sort((a, b) => a - b);
  return visible.flatMap((item, index) => {
    const previous = visible[index - 1];
    return index > 0 && item - previous > 1 ? (["...", item] as const) : [item];
  });
}

export function PaginationNav({ count }: { count: number }) {
  const { page, size, goToPage } = useListQuery();
  const total = Math.ceil(count / size);
  const current = Math.min(page, total);
  const pages = buildPageItems(current, total);

  return (
    <div className="w-full flex shrink-0 flex-wrap items-center justify-center gap-3 @toolbar-md:justify-between">
      <Pagination
        size="sm"
        className="w-auto flex-wrap justify-center font-mono"
      >
        <Pagination.Summary className="self-center">
          {`${count} Results · Page ${current} / ${total}`}
        </Pagination.Summary>
        <Pagination.Content className="flex-wrap justify-center gap-0.5 self-center">
          <Pagination.Item>
            <Pagination.Previous
              aria-label="Previous page"
              isDisabled={current <= 1}
              onPress={() => goToPage(current - 1)}
              className={NAV_ITEM}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {pages.map((item, index) => (
            <Pagination.Item key={`${item}-${index}`}>
              {item === "..." ? (
                <Pagination.Ellipsis className={PAGE_ITEM} />
              ) : (
                <Pagination.Link
                  isActive={item === current}
                  onPress={() => goToPage(item)}
                  className={
                    item === current
                      ? `ring-accent ring-2 ${PAGE_ITEM}`
                      : PAGE_ITEM
                  }
                >
                  {item}
                </Pagination.Link>
              )}
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Next
              aria-label="Next page"
              isDisabled={current >= total}
              onPress={() => goToPage(current + 1)}
              className={NAV_ITEM}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>

      <div className="border-separator flex flex-wrap items-center justify-center gap-1 rounded-lg border p-0.5">
        {sizeOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === size ? "primary" : "ghost"}
            className="h-7 px-2"
            onPress={() => goToPage(1, option)}
          >
            {option}
          </Button>
        ))}
        <span className="text-muted px-2 text-xs font-mono">
          Records / Page
        </span>
      </div>
    </div>
  );
}
