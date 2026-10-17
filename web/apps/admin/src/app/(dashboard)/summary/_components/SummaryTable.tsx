"use client";

import type { summary } from "@/models/orm";
import type { Sort } from "@/models/types";
import { removeSummary } from "@/actions/summary";
import { Table } from "@heroui/react";
import { CopyableText } from "../../_components/CopyableText";
import { DeleteButton } from "../../_components/DeleteButton";
import { PaginationNav } from "../../_components/PaginationNav";
import { SortButton } from "../../_components/SortButton";
import { TableEmptyState } from "../../_components/TableEmptyState";
import { ViewButton } from "../../_components/ViewButton";
import { useTimeZone } from "@/hooks/useTimeZone";
import { useTableQuery } from "@/hooks/useTableQuery";
import { formatDateTime } from "common";

export function SummaryTable({
  items,
  count,
}: {
  items: (typeof summary.$inferSelect)[];
  count: number;
}) {
  const timeZone = useTimeZone();
  const { primary, toggleSort, isPending } = useTableQuery<Sort>();

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Summaries" className="table-fixed min-w-150">
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
            renderEmptyState={() => (
              <div className="absolute inset-0 bg-background-tertiary dark:bg-surface-secondary">
                <TableEmptyState />
              </div>
            )}
          >
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-muted wrap-break-word">
                  {item.id}
                </Table.Cell>
                <Table.Cell>
                  <CopyableText>{item.url}</CopyableText>
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.createAt, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.updateAt, timeZone)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="summary" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.id}
                      resource="summary"
                      onDelete={removeSummary}
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
