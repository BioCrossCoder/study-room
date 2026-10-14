"use client";

import { Button, Pagination } from "@heroui/react";
import { usePaginationNav } from "@/hooks/usePaginationNav";

const sizeOptions = [10, 20, 50, 100] as const;

const PAGE_ITEM = "w-auto h-7 min-w-7 px-1.5";
const NAV_ITEM = "w-auto h-7 min-w-7";

export function PaginationNav({ count }: { count: number }) {
  const { page, size, total, pages, go } = usePaginationNav(count);

  return (
    <div className="w-full flex shrink-0 flex-wrap items-center justify-center gap-3 @toolbar-md:justify-between">
      <Pagination
        size="sm"
        className="w-auto flex-wrap justify-center font-mono"
      >
        <Pagination.Summary className="self-center">
          {`${count} Results · Page ${page} / ${total}`}
        </Pagination.Summary>
        <Pagination.Content className="flex-wrap justify-center gap-0.5 self-center">
          <Pagination.Item>
            <Pagination.Previous
              aria-label="Previous page"
              isDisabled={page <= 1}
              onPress={() => go(page - 1)}
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
                  isActive={item === page}
                  onPress={() => go(item)}
                  className={
                    item === page ? `ring-accent ring-2 ${PAGE_ITEM}` : PAGE_ITEM
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
              isDisabled={page >= total}
              onPress={() => go(page + 1)}
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
            onPress={() => go(1, option)}
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
