"use client";

import { Button, Pagination } from "@heroui/react";
import { usePaginationNav } from "@/hooks/usePaginationNav";

const sizeOptions = [10, 20, 50, 100] as const;

export function PaginationNav({ count }: { count: number }) {
  const { page, size, total, pages, go } = usePaginationNav(count);

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 lg:justify-between">
      <Pagination size="sm" className="w-auto">
        <Pagination.Summary className="self-center">
          {`${count} Results · Page ${page} / ${total}`}
        </Pagination.Summary>
        <Pagination.Content className="self-center">
          <Pagination.Item>
            <Pagination.Previous
              aria-label="Previous page"
              isDisabled={page <= 1}
              onPress={() => go(page - 1)}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {pages.map((item, index) => (
            <Pagination.Item key={`${item}-${index}`}>
              {item === "..." ? (
                <Pagination.Ellipsis />
              ) : (
                <Pagination.Link
                  isActive={item === page}
                  onPress={() => go(item)}
                  className={item === page ? "ring-accent ring-2" : undefined}
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
            onPress={() => go(1, option)}
          >
            {option}
          </Button>
        ))}
        <span className="text-muted px-2 text-sm">Records / Page</span>
      </div>
    </div>
  );
}
