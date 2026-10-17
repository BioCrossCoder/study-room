"use client";

import type { bookmark } from "@/models/orm";
import type { Sort } from "@/models/types";
import { removeBookmark } from "@/actions/bookmark";
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

export function BookmarkTable({
  items,
  count,
}: {
  items: (typeof bookmark.$inferSelect)[];
  count: number;
}) {
  const { primary, toggleSort, isPending } = useListQuery<Sort>();

  const deleteBookmark = safeWrap(removeBookmark, "Failed to delete bookmark");

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Bookmarks" className="table-fixed min-w-150">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 @5xl:w-50 @8xl:w-85">
              ID
            </Table.Column>
            <Table.Column>URL</Table.Column>
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
                  <CopyableText>{item.url}</CopyableText>
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.createAt} />
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.updateAt} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="bookmark" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.id}
                      resource="bookmark"
                      onDelete={deleteBookmark}
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
