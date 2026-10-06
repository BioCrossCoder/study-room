"use client";

import type { library } from "@/models/orm";
import { removeLibrary } from "@/actions/library";
import { Button, Link, Table } from "@heroui/react";
import { ExternalLink, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "../../_components/DeleteButton";
import { formatDateTime } from "common";

export function LibraryTable({
  items,
}: {
  items: (typeof library.$inferSelect)[];
}) {
  const router = useRouter();
  return items.length === 0 ? (
    <div className="text-muted flex min-h-0 flex-1 items-center justify-center py-6 text-sm">
      No libraries yet.
    </div>
  ) : (
    <Table className="min-h-0 flex-1">
      <Table.ScrollContainer className="h-full overflow-y-auto">
        <Table.Content aria-label="Libraries">
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-1 [&_th]:bg-surface-secondary">
            <Table.Column isRowHeader>ID</Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column>URL</Table.Column>
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
                <Table.Cell>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex w-full min-w-0 items-center gap-1"
                  >
                    <Link.Icon className="shrink-0">
                      <ExternalLink className="size-3.5" />
                    </Link.Icon>
                    <span className="min-w-0 flex-1 truncate">{item.url}</span>
                  </Link>
                </Table.Cell>
                <Table.Cell>{formatDateTime(item.createAt)}</Table.Cell>
                <Table.Cell>{formatDateTime(item.updateAt)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      className="bg-surface-secondary hover:bg-surface-tertiary"
                      aria-label="View details"
                      onPress={() => router.push(`/library/${item.id}`)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <DeleteButton
                      id={item.id}
                      name={item.name}
                      resource="library"
                      onDelete={removeLibrary}
                    />
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
