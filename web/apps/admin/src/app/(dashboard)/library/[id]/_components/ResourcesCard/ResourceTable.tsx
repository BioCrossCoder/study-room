"use client";

import type { resource } from "@/models/orm";
import { Button, Table } from "@heroui/react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "common";

export function ResourceTable({
  items,
}: {
  items: (typeof resource.$inferSelect)[];
}) {
  const router = useRouter();
  return (
    <Table className="min-h-0 flex-1">
      <Table.ScrollContainer className="h-full overflow-y-auto">
        <Table.Content aria-label="Resources">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-1 [&_th]:bg-surface-secondary">
            <Table.Column>ID</Table.Column>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Created</Table.Column>
            <Table.Column>Updated</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-muted font-mono text-xs">
                  {item.id}
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{formatDateTime(item.createAt)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.updateAt)}</Table.Cell>
                <Table.Cell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="bg-surface-secondary hover:bg-surface-tertiary"
                    aria-label="View details"
                    onPress={() => router.push(`/resource/${item.id}`)}
                  >
                    <Eye className="size-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
