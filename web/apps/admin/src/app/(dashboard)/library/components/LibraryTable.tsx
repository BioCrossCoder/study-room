"use client";

import type { library } from "@/models/orm";
import type { Sort } from "@/models/types";
import { removeLibrary } from "@/actions/library";
import { Table } from "@heroui/react";
import { CopyableText } from "@/components/CopyableText";
import { DateField } from "@/components/DateField";
import { IdField } from "@/components/IdField";
import { SortButton } from "@/components/SortButton";
import { TableEmptyState } from "@/components/TableEmptyState";
import { DeleteButton } from "../../components/DeleteButton";
import { PaginationNav } from "../../../../components/PaginationNav";
import { ViewButton } from "../../components/ViewButton";
import { safeWrap } from "@/common/utils";
import { useListQuery } from "@/hooks/useListQuery";

export function LibraryTable({
  items,
  count,
}: {
  items: (typeof library.$inferSelect)[];
  count: number;
}) {
  const { primary, toggleSort, isPending } = useListQuery<Sort>();

  const deleteLibrary = safeWrap(removeLibrary, "Failed to delete library");

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Libraries" className="table-fixed min-w-150">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 @5xl:w-50 @8xl:w-85">
              ID
            </Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column className="w-32 @5xl:w-40 @7xl:w-68">
              <SortButton field="createAt" sort={primary} onSort={toggleSort}>
                Created
              </SortButton>
            </Table.Column>
            <Table.Column className="w-32 @5xl:w-40 @7xl:w-68">
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
                <Table.Cell className="text-center!">
                  <DateField value={item.createAt} />
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.updateAt} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="library" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.name}
                      resource="library"
                      onDelete={deleteLibrary}
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
