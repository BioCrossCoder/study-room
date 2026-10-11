"use client";

import type { resource } from "@/models/orm";
import { Button, Table } from "@heroui/react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";

export function ResourceTable({
  items,
}: {
  items: (typeof resource.$inferSelect)[];
}) {
  const router = useRouter();
  const timeZone = useTimeZone();
  return (
    <Table className="min-h-0 flex-1">
      <Table.ScrollContainer>
        <Table.Content aria-label="Resources" className="table-fixed min-w-150">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-surface-secondary">
            <Table.Column isRowHeader className="w-32 lg:w-50 2xl:w-85">
              ID
            </Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-65 text-center!">
              Created
            </Table.Column>
            <Table.Column className="w-32 lg:w-40 xl:w-65 text-center!">
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
                <Table.Cell className="wrap-break-word">{item.name}</Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.createAt, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
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
                      onPress={() => router.push(`/resource/${item.id}`)}
                    >
                      <Eye />
                    </Button>
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
