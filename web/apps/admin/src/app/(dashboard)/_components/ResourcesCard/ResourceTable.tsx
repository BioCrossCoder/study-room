"use client";

import type { resource } from "@/models/orm";
import { Table } from "@heroui/react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { ClippedText } from "../ClippedText";
import { ViewButton } from "../ViewButton";

export function ResourceTable({
  items,
}: {
  items: (typeof resource.$inferSelect)[];
}) {
  const timeZone = useTimeZone();
  return (
    <Table className="min-h-0 flex-1">
      <Table.ScrollContainer>
        <Table.Content aria-label="Resources" className="table-fixed min-w-150">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 lg:w-50 2xl:w-85">
              ID
            </Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-68 text-center!">
              Created
            </Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-68 text-center!">
              Updated
            </Table.Column>
            <Table.Column className="w-28 text-center!">Actions</Table.Column>
          </Table.Header>
          <Table.Body className="font-mono">
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-muted wrap-break-word">
                  {item.id}
                </Table.Cell>
                <Table.Cell>
                  <ClippedText>{item.name}</ClippedText>
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
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
