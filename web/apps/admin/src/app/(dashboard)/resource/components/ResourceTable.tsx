"use client";

import type { resource } from "@/models/orm";
import type { Sort } from "@/models/types";
import { removeResource } from "@/actions/resource";
import { Table } from "@heroui/react";
import { ClippedText } from "@/components/ClippedText";
import { CopyableText } from "@/components/CopyableText";
import { DateField } from "@/components/DateField";
import { IdField } from "@/components/IdField";
import { SortButton } from "@/components/SortButton";
import { TableEmptyState } from "@/components/TableEmptyState";
import { DeleteButton } from "../../components/DeleteButton";
import { PaginationNav } from "../../../../components/PaginationNav";
import { ViewButton } from "../../components/ViewButton";
import { useListQuery } from "@/hooks/useListQuery";
import { LibraryFilter } from "./LibraryFilter";
import { safeWrap } from "@/common/utils";

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
  const { filters, base, primary, toggleSort, isPending, applyFilter } =
    useListQuery<ResourceSort>();

  const deleteResource = safeWrap(removeResource, "Failed to delete resource");
  const libraryIds = filters.flatMap((condition) =>
    typeof condition.libraryId === "string" ? [condition.libraryId] : [],
  );
  const libraryNames = new Map(libraries.map((item) => [item.id, item.name]));

  const applyLibraryFilter = (ids: readonly string[]) => {
    const criteria = { ...base, libraryId: undefined };
    applyFilter(
      ids.length > 0
        ? ids.map((libraryId) => ({ ...criteria, libraryId }))
        : [criteria],
    );
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
            renderEmptyState={() => <TableEmptyState overlay />}
          >
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <IdField>{item.id}</IdField>
                </Table.Cell>
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
                  <DateField value={item.lastVisit} />
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.createAt} />
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.updateAt} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="resource" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.name}
                      resource="resource"
                      onDelete={deleteResource}
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
