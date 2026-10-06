"use client";

import type { library } from "@/models/orm";
import type { LibraryFilter, Sort } from "@/models/types";
import { removeLibrary } from "@/actions/library";
import { Button, Link, Table } from "@heroui/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ExternalLink,
  Eye,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DeleteButton } from "../../_components/DeleteButton";
import { TableDateFilter } from "../../_components/TableDateFilter";
import { TableSearch } from "../../_components/TableSearch";
import { parseFilter } from "@/common/filter";
import { formatDateTime } from "common";

const FIELDS = [{ id: "name", label: "Name" }] as const;

export function LibraryTable({
  items,
}: {
  items: (typeof library.$inferSelect)[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const sort = JSON.parse(searchParams.get("sort") ?? "[]") as Sort[];
  const primary =
    sort[0] ?? ({ field: "createAt", direction: "desc" } satisfies Sort);

  const toggleSort = (field: Sort["field"]) => {
    const query = new URLSearchParams(searchParams);
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
    );
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  const applied = parseFilter<LibraryFilter>(searchParams.get("filter")).name;
  const [keyword, setKeyword] = useState(applied ?? "");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 lg:justify-between">
        <TableDateFilter />
        <TableSearch
          fields={FIELDS}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </div>
      {items.length === 0 ? (
        <div className="text-muted flex min-h-0 flex-1 items-center justify-center py-6 text-sm">
          No libraries yet.
        </div>
      ) : (
        <Table
          className={`min-h-0 flex-1 ${isPending ? "opacity-60" : undefined}`}
        >
          <Table.ScrollContainer className="h-full overflow-y-auto">
            <Table.Content aria-label="Libraries" className="table-fixed">
              <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-1 [&_th]:bg-surface-secondary">
                <Table.Column
                  isRowHeader
                  className="w-20 sm:w-24 lg:w-28 xl:w-36"
                >
                  ID
                </Table.Column>
                <Table.Column className="w-14 sm:w-16 md:w-20 lg:w-28">
                  Name
                </Table.Column>
                <Table.Column className="min-w-[220px]">URL</Table.Column>
                <Table.Column className="w-32 sm:w-44 lg:w-46">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit text-xs hover:bg-transparent"
                    onPress={() => toggleSort("createAt")}
                  >
                    Created
                    {primary.field === "createAt" ? (
                      primary.direction === "asc" ? (
                        <ArrowUp className="text-accent size-3.5 shrink-0" />
                      ) : (
                        <ArrowDown className="text-accent size-3.5 shrink-0" />
                      )
                    ) : (
                      <ChevronsUpDown className="text-muted size-3.5 shrink-0 opacity-50" />
                    )}
                  </Button>
                </Table.Column>
                <Table.Column className="w-32 sm:w-44 lg:w-46">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit text-xs hover:bg-transparent"
                    onPress={() => toggleSort("updateAt")}
                  >
                    Updated
                    {primary.field === "updateAt" ? (
                      primary.direction === "asc" ? (
                        <ArrowUp className="text-accent size-3.5 shrink-0" />
                      ) : (
                        <ArrowDown className="text-accent size-3.5 shrink-0" />
                      )
                    ) : (
                      <ChevronsUpDown className="text-muted size-3.5 shrink-0 opacity-50" />
                    )}
                  </Button>
                </Table.Column>
                <Table.Column className="w-28">Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="text-muted w-20 break-words font-mono text-xs sm:w-24 lg:w-28">
                      {item.id}
                    </Table.Cell>
                    <Table.Cell className="w-14 break-words sm:w-16 md:w-20 lg:w-28">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="min-w-[220px]">
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex w-full items-center gap-1.5 overflow-hidden"
                      >
                        <Link.Icon className="shrink-0 size-3.5">
                          <ExternalLink />
                        </Link.Icon>
                        <span className="min-w-0 flex-1 truncate">
                          {item.url}
                        </span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="w-32 sm:w-44 lg:w-46">
                      {formatDateTime(item.createAt)}
                    </Table.Cell>
                    <Table.Cell className="w-32 sm:w-44 lg:w-46">
                      {formatDateTime(item.updateAt)}
                    </Table.Cell>
                    <Table.Cell className="w-28">
                      <div className="flex items-center gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="bg-surface-secondary hover:bg-surface-tertiary"
                          aria-label="View details"
                          onPress={() => router.push(`/library/${item.id}`)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <DeleteButton
                          id={item.id}
                          name={item.name}
                          resource="library"
                          onDelete={removeLibrary}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
