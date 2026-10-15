"use client";

import type { resource } from "@/models/orm";
import type { Sort } from "@/models/types";
import { removeResource } from "@/actions/resource";
import { Table } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { ClippedText } from "../../_components/ClippedText";
import { CopyableText } from "../../_components/CopyableText";
import { DeleteButton } from "../../_components/DeleteButton";
import { PaginationNav } from "../../_components/PaginationNav";
import { SortButton } from "../../_components/SortButton";
import { TableEmptyState } from "../../_components/TableEmptyState";
import { ViewButton } from "../../_components/ViewButton";
import { LibraryFilter } from "./LibraryFilter";

type ResourceSort = {
  field: Sort["field"] | "lastVisit";
  direction: Sort["direction"];
};

export function ResourceTable({
  items,
  count,
  libraries,
}: {
  items: (typeof resource.$inferSelect)[];
  count: number;
  libraries: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeZone = useTimeZone();
  const sort = JSON.parse(searchParams.get("sort") ?? "[]") as ResourceSort[];
  const primary =
    sort[0] ??
    ({ field: "createAt", direction: "desc" } satisfies ResourceSort);
  const conditions = JSON.parse(searchParams.get("filter") ?? "[]") as Record<
    string,
    unknown
  >[];
  const [base = {}] = conditions;
  const libraryIds = conditions.flatMap((condition) =>
    typeof condition.libraryId === "string" ? [condition.libraryId] : [],
  );
  const libraryNames = new Map(libraries.map((item) => [item.id, item.name]));

  const applyLibraryFilter = (ids: readonly string[]) => {
    const criteria = { ...base, libraryId: undefined };
    const filter =
      ids.length > 0
        ? ids.map((libraryId) => ({ ...criteria, libraryId }))
        : [criteria];
    const query = new URLSearchParams(searchParams);
    query.set("filter", JSON.stringify(filter));
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  const toggleSort = (field: ResourceSort["field"]) => {
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

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Resources"
          className="table-fixed min-w-244 @7xl:min-w-278 @9xl:min-w-397"
        >
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 @7xl:w-50 @9xl:w-85">
              ID
            </Table.Column>
            <Table.Column className="w-40">Name</Table.Column>
            <Table.Column className="w-40">
              <LibraryFilter
                selectionMode="multiple"
                value={libraryIds}
                onApply={applyLibraryFilter}
              />
            </Table.Column>
            <Table.Column className="w-32 @7xl:w-40 @9xl:w-68 text-center!">
              <SortButton field="lastVisit" sort={primary} onSort={toggleSort}>
                Last Visit
              </SortButton>
            </Table.Column>
            <Table.Column className="w-32 @7xl:w-40 @9xl:w-68">
              <SortButton field="createAt" sort={primary} onSort={toggleSort}>
                Created
              </SortButton>
            </Table.Column>
            <Table.Column className="w-32 @7xl:w-40 @9xl:w-68">
              <SortButton field="updateAt" sort={primary} onSort={toggleSort}>
                Updated
              </SortButton>
            </Table.Column>
            <Table.Column className="w-28 text-center!">Actions</Table.Column>
          </Table.Header>
          <Table.Body
            className="font-mono"
            renderEmptyState={() => (
              <div className="absolute inset-0 bg-background-tertiary dark:bg-surface-secondary">
                <TableEmptyState />
              </div>
            )}
          >
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-muted">{item.id}</Table.Cell>
                <Table.Cell>
                  <CopyableText>{item.name}</CopyableText>
                </Table.Cell>
                <Table.Cell>
                  {item.libraryId ? (
                    <ClippedText>
                      {libraryNames.get(item.libraryId) ?? item.libraryId}
                    </ClippedText>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.lastVisit, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.createAt, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.updateAt, timeZone)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="resource" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.name}
                      resource="resource"
                      onDelete={removeResource}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {items.length > 0 && (
        <Table.Footer>
          <PaginationNav count={count} />
        </Table.Footer>
      )}
    </Table>
  );
}
