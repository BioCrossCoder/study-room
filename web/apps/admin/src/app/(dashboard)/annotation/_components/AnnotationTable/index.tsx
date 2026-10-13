"use client";

import type { annotation } from "@/models/orm";
import type { Sort } from "@/models/types";
import { annotationTypes } from "@/models/enums";
import { removeAnnotation } from "@/actions/annotation";
import { Table } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ClippedText } from "../../../_components/ClippedText";
import { CopyableText } from "../../../_components/CopyableText";
import { DeleteButton } from "../../../_components/DeleteButton";
import { PaginationNav } from "../../../_components/PaginationNav";
import { SortButton } from "../../../_components/SortButton";
import { TableEmptyState } from "../../../_components/TableEmptyState";
import { ViewButton } from "../../../_components/ViewButton";
import { useTimeZone } from "@/hooks/useTimeZone";
import { formatDateTime } from "common";
import { TypeCell } from "./TypeCell";
import { TypeFilter } from "./TypeFilter";
import { UrlFilter } from "./UrlFilter";

export function AnnotationTable({
  items,
  count,
}: {
  items: (typeof annotation.$inferSelect)[];
  count: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeZone = useTimeZone();
  const sort = JSON.parse(searchParams.get("sort") ?? "[]") as Sort[];
  const primary =
    sort[0] ?? ({ field: "createAt", direction: "desc" } satisfies Sort);
  const conditions = JSON.parse(searchParams.get("filter") ?? "[]") as Record<
    string,
    unknown
  >[];
  const [base = {}] = conditions;
  const urlFilter = (base.url as string | undefined) ?? "";
  const selectedTypes = conditions.flatMap((condition) =>
    typeof condition.type === "string" ? [condition.type] : [],
  );
  const typeFilter = selectedTypes.length > 0 ? selectedTypes : annotationTypes;
  const timeFilter = { createAt: base.createAt, updateAt: base.updateAt };

  const applyFilter = (next: { url: string; types: readonly string[] }) => {
    const criteria = { ...timeFilter, url: next.url || undefined };
    const filter =
      next.types.length > 0 && next.types.length < annotationTypes.length
        ? next.types.map((type) => ({ ...criteria, type }))
        : [criteria];
    const query = new URLSearchParams(searchParams);
    query.set("filter", JSON.stringify(filter));
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

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

  return (
    <Table
      className={`bg-background-tertiary dark:bg-surface-secondary min-h-0 ${items.length === 0 ? "flex-1" : undefined} ${isPending ? "opacity-60" : undefined}`}
    >
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Annotations"
          className="table-fixed min-w-216 lg:min-w-258 xl:min-w-314 2xl:min-w-366"
        >
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-background-tertiary dark:[&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 lg:w-50 2xl:w-85">
              ID
            </Table.Column>
            <Table.Column className="w-32 lg:w-40 2xl:w-52">
              <UrlFilter
                value={urlFilter}
                onApply={(url) => applyFilter({ url, types: typeFilter })}
              />
            </Table.Column>
            <Table.Column className="w-20 lg:w-24">
              <TypeFilter
                value={typeFilter}
                onApply={(types) => applyFilter({ url: urlFilter, types })}
              />
            </Table.Column>
            <Table.Column>Content</Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-68">
              <SortButton field="createAt" sort={primary} onSort={toggleSort}>
                Created
              </SortButton>
            </Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-68">
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
                  <CopyableText>{item.url}</CopyableText>
                </Table.Cell>
                <Table.Cell className="text-center!">
                  <TypeCell type={item.type} />
                </Table.Cell>
                <Table.Cell>
                  <ClippedText>{item.content}</ClippedText>
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.createAt, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.updateAt, timeZone)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-around">
                    <ViewButton resource="annotation" id={item.id} />
                    <DeleteButton
                      id={item.id}
                      name={item.id}
                      resource="annotation"
                      onDelete={removeAnnotation}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <PaginationNav count={count} />
      </Table.Footer>
    </Table>
  );
}
