"use client";

import type { library } from "@/models/orm";
import type { LibraryFilter, Sort } from "@/models/types";
import { removeLibrary } from "@/actions/library";
import { Button, Table } from "@heroui/react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Eye, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DeleteButton } from "../../_components/DeleteButton";
import { TableDateFilter } from "../../_components/TableDateFilter";
import { TableSearch } from "../../_components/TableSearch";
import { parseFilterParam } from "@/common/filter";
import { COMPACT_MEDIA } from "@/common/media";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTimeZone } from "@/hooks/useTimeZone";
import { formatDateTime } from "common";

const FIELDS = [{ id: "name", label: "Name" }] as const;

const STICKY_HOVER =
  "group-hover:bg-[color-mix(in_srgb,var(--surface)_40%,var(--surface-secondary))]!";

export function LibraryTable({
  items,
}: {
  items: (typeof library.$inferSelect)[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isCompact = useMediaQuery(COMPACT_MEDIA);
  const timeZone = useTimeZone();
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

  const applied = parseFilterParam<LibraryFilter>(
    searchParams.get("filter"),
  ).name;
  const [keyword, setKeyword] = useState(applied ?? "");

  const create = () => {
    startTransition(() => {
      router.push("/library/new");
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 lg:justify-between">
        <TableDateFilter />
        <div className="flex w-full items-center gap-3 lg:w-auto lg:flex-none">
          <TableSearch
            fields={FIELDS}
            keyword={keyword}
            setKeyword={setKeyword}
          />
          <Button
            variant="primary"
            className="shrink-0"
            isIconOnly={isCompact}
            aria-label={isCompact ? "Create library" : undefined}
            onPress={create}
          >
            {isCompact ? <Plus className="size-4" /> : "New Library"}
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="text-muted flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-6 text-sm">
          <span>No libraries yet.</span>
          <Button
            variant="primary"
            aria-label="Create library"
            onPress={create}
          >
            New Library
          </Button>
        </div>
      ) : (
        <Table
          className={`@container min-h-0 flex-1 ${isPending ? "opacity-60" : undefined}`}
        >
          <Table.ScrollContainer className="h-full overflow-x-auto overflow-y-auto">
            <Table.Content
              aria-label="Libraries"
              className="table-fixed min-w-118 sm:min-w-132 md:min-w-136 lg:min-w-156 xl:min-w-172"
            >
              <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-surface-secondary">
                <Table.Column
                  isRowHeader
                  className="bg-surface-secondary sticky left-0 z-10! w-20 sm:w-24 lg:w-28 xl:w-36"
                >
                  ID
                </Table.Column>
                <Table.Column className="bg-surface-secondary sticky left-20 z-10! w-14 sm:left-24 sm:w-16 md:w-20 lg:left-28 lg:w-28 xl:left-36">
                  Name
                </Table.Column>
                <Table.Column className="w-28 text-center! sm:w-32 lg:w-36">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit w-full! text-xs hover:bg-transparent"
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
                <Table.Column className="w-28 text-center! sm:w-32 lg:w-36">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit w-full! text-xs hover:bg-transparent"
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
                <Table.Column className="bg-surface-secondary sticky right-0 z-10! w-28 text-center!">
                  Actions
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id} className="group">
                    <Table.Cell
                      className={`${STICKY_HOVER} bg-surface! sticky left-0 z-1 text-muted break-words font-mono text-xs`}
                    >
                      {item.id}
                    </Table.Cell>
                    <Table.Cell
                      className={`${STICKY_HOVER} bg-surface! sticky left-20 z-1 break-words sm:left-24 lg:left-28 xl:left-36`}
                    >
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="text-center!">
                      {formatDateTime(item.createAt, timeZone)}
                    </Table.Cell>
                    <Table.Cell className="text-center!">
                      {formatDateTime(item.updateAt, timeZone)}
                    </Table.Cell>
                    <Table.Cell
                      className={`${STICKY_HOVER} bg-surface! sticky right-0 z-1 text-center!`}
                    >
                      <div className="flex items-center justify-center gap-1">
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
