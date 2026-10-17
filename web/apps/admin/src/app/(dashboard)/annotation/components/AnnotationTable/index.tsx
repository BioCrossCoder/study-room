"use client";

import type { annotation } from "@/models/orm";
import type { Sort } from "@/models/types";
import { annotationTypes } from "@/models/enums";
import { removeAnnotation } from "@/actions/annotation";
import { Table } from "@heroui/react";
import { ClippedText } from "@/components/ClippedText";
import { CopyableText } from "@/components/CopyableText";
import { DateField } from "@/components/DateField";
import { IdField } from "@/components/IdField";
import { SortButton } from "@/components/SortButton";
import { TableEmptyState } from "@/components/TableEmptyState";
import { DeleteButton } from "../../../components/DeleteButton";
import { PaginationNav } from "../../../../../components/PaginationNav";
import { ViewButton } from "../../../components/ViewButton";
import { useListQuery } from "@/hooks/useListQuery";
import { TypeField } from "./TypeField";
import { TypeFilter } from "./TypeFilter";
import { UrlFilter } from "./UrlFilter";
import { safeWrap } from "@/common/utils";

export function AnnotationTable({
  items,
  count,
}: {
  items: (typeof annotation.$inferSelect)[];
  count: number;
}) {
  const { filters, base, primary, toggleSort, isPending, applyFilter } =
    useListQuery<Sort>();

  const deleteAnnotation = safeWrap(
    removeAnnotation,
    "Failed to delete annotation",
  );
  const urlFilter = typeof base.url === "string" ? base.url : "";
  const selectedTypes = filters.flatMap((condition) =>
    typeof condition.type === "string" ? [condition.type] : [],
  );
  const typeFilter = selectedTypes.length > 0 ? selectedTypes : annotationTypes;
  const timeFilter = { createAt: base.createAt, updateAt: base.updateAt };

  const buildConditions = (
    criteria: Record<string, unknown>,
    types: readonly string[],
  ) =>
    types.length > 0 && types.length < annotationTypes.length
      ? types.map((type) => ({ ...criteria, type }))
      : [criteria];

  const applyUrlFilter = (url: string) => {
    applyFilter(
      buildConditions({ ...timeFilter, url: url || undefined }, typeFilter),
    );
  };

  const applyTypeFilter = (types: readonly string[]) => {
    applyFilter(
      buildConditions(
        { ...timeFilter, url: urlFilter || undefined },
        types,
      ),
    );
  };

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Annotations"
          className="table-fixed min-w-216 @5xl:min-w-258 @7xl:min-w-314 @8xl:min-w-366"
        >
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 @5xl:w-50 @8xl:w-85">
              ID
            </Table.Column>
            <Table.Column className="w-32 @5xl:w-40 @8xl:w-52">
              <UrlFilter value={urlFilter} onApply={applyUrlFilter} />
            </Table.Column>
            <Table.Column className="w-20 @5xl:w-24">
              <TypeFilter value={typeFilter} onApply={applyTypeFilter} />
            </Table.Column>
            <Table.Column>Content</Table.Column>
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
                  <TypeField type={item.type} />
                </Table.Cell>
                <Table.Cell>
                  <ClippedText>{item.content}</ClippedText>
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.createAt} />
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <DateField value={item.updateAt} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="annotation" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.id}
                      resource="annotation"
                      onDelete={deleteAnnotation}
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
