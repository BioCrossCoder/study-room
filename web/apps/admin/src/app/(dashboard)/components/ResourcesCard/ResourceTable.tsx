"use client";

import type { resource } from "@/models/orm";
import { Table } from "@heroui/react";
import { ClippedText } from "@/components/ClippedText";
import { DateField } from "@/components/DateField";
import { IdField } from "@/components/IdField";
import { ViewButton } from "../ViewButton";

export function ResourceTable({
  items,
}: {
  items: (typeof resource.$inferSelect)[];
}) {
  return (
    <Table className="min-h-0 flex-1">
      <Table.ScrollContainer>
        <Table.Content aria-label="Resources" className="table-fixed min-w-150">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-40 @5xl:w-50 @8xl:w-85">
              ID
            </Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column className="w-32 @5xl:w-40 @7xl:w-68 text-center!">
              Created
            </Table.Column>
            <Table.Column className="w-32 @5xl:w-40 @7xl:w-68 text-center!">
              Updated
            </Table.Column>
            <Table.Column className="w-28 text-center!">Actions</Table.Column>
          </Table.Header>
          <Table.Body className="font-mono">
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <IdField>{item.id}</IdField>
                </Table.Cell>
                <Table.Cell>
                  <ClippedText>{item.name}</ClippedText>
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
