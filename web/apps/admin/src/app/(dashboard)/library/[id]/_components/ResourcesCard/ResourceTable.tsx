"use client";

import type { resource } from "@/models/orm";
import { Button, Table } from "@heroui/react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";

const STICKY_HOVER =
  "group-hover:bg-[color-mix(in_srgb,var(--surface)_40%,var(--surface-secondary))]!";

export function ResourceTable({
  items,
}: {
  items: (typeof resource.$inferSelect)[];
}) {
  const router = useRouter();
  const timeZone = useTimeZone();
  return (
    <Table className="@container min-h-0 flex-1">
      <Table.ScrollContainer className="h-full overflow-x-auto overflow-y-auto">
        <Table.Content
          aria-label="Resources"
          className="table-fixed min-w-112 sm:min-w-128 md:min-w-128 lg:min-w-144 xl:min-w-156"
        >
          <Table.Header className="[&_th]:sticky [&_th]:top-0 [&_th]:z-2 [&_th]:bg-surface-secondary">
            <Table.Column
              isRowHeader
              className="bg-surface-secondary sticky left-0 z-20! w-20 sm:w-24 lg:w-28 xl:w-36"
            >
              ID
            </Table.Column>
            <Table.Column className="bg-surface-secondary sticky left-20 z-20! w-16 sm:left-24 sm:w-20 lg:left-28 lg:w-24 xl:left-36 xl:w-28">
              Name
            </Table.Column>
            <Table.Column className="w-28 text-center! sm:w-32 lg:w-36">
              Created
            </Table.Column>
            <Table.Column className="w-28 text-center! sm:w-32 lg:w-36">
              Updated
            </Table.Column>
            <Table.Column className="bg-surface-secondary sticky right-0 z-20! w-20 text-center!">
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id} className="group">
                <Table.Cell
                  className={`${STICKY_HOVER} bg-surface! sticky left-0 z-10 text-muted break-words font-mono text-xs`}
                >
                  {item.id}
                </Table.Cell>
                <Table.Cell
                  className={`${STICKY_HOVER} bg-surface! sticky left-20 z-10 break-words sm:left-24 lg:left-28 xl:left-36`}
                >
                  {item.name}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.createAt, timeZone)}
                </Table.Cell>
                <Table.Cell className="text-center!">
                  {formatDateTime(item.updateAt, timeZone)}
                </Table.Cell>
                <Table.Cell
                  className={`${STICKY_HOVER} bg-surface! sticky right-0 z-10 text-center!`}
                >
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
