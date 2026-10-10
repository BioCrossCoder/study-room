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
    <div className="min-h-0 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 justify-between">
        <TableDateFilter />
        <div className="flex w-full gap-3 lg:w-auto">
          <TableSearch
            fields={FIELDS}
            keyword={keyword}
            setKeyword={setKeyword}
          />
          <Button
            variant="primary"
            className="shrink-0"
            isIconOnly={isCompact}
            aria-label="Create library"
            onPress={create}
          >
            {isCompact ? <Plus /> : "New Library"}
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <span className="text-lg">No libraries yet.</span>
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
          className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${isPending ? "opacity-60" : undefined}`}
        >
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Libraries"
              className="table-fixed min-w-150"
            >
              <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
                <Table.Column isRowHeader className="w-32 lg:w-50 2xl:w-85">
                  ID
                </Table.Column>
                <Table.Column>Name</Table.Column>
                <Table.Column className="w-32 lg:w-40 xl:w-65">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit w-full! text-xs hover:bg-transparent"
                    onPress={() => toggleSort("createAt")}
                  >
                    Created
                    {primary.field === "createAt" ? (
                      primary.direction === "asc" ? (
                        <ArrowUp className="text-accent size-3.5" />
                      ) : (
                        <ArrowDown className="text-accent size-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="text-muted size-3.5" />
                    )}
                  </Button>
                </Table.Column>
                <Table.Column className="w-32 lg:w-40 xl:w-65">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-inherit w-full! text-xs hover:bg-transparent"
                    onPress={() => toggleSort("updateAt")}
                  >
                    Updated
                    {primary.field === "updateAt" ? (
                      primary.direction === "asc" ? (
                        <ArrowUp className="text-accent size-3.5" />
                      ) : (
                        <ArrowDown className="text-accent size-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="text-muted size-3.5" />
                    )}
                  </Button>
                </Table.Column>
                <Table.Column className="w-28 text-center!">
                  Actions
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="text-muted font-mono">
                      {item.id}
                    </Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell className="text-center! font-mono">
                      {formatDateTime(item.createAt, timeZone)}
                    </Table.Cell>
                    <Table.Cell className="text-center! font-mono">
                      {formatDateTime(item.updateAt, timeZone)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-around">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="bg-surface-secondary hover:bg-surface-tertiary"
                          aria-label="View details"
                          onPress={() => router.push(`/library/${item.id}`)}
                        >
                          <Eye />
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
