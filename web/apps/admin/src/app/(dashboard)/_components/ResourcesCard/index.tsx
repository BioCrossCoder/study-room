import type { resource } from "@/models/orm";
import { Card, Chip } from "@heroui/react";
import { Folder } from "lucide-react";
import { ResourceTable } from "./ResourceTable";
import { TableEmptyState } from "../TableEmptyState";

export function ResourcesCard({
  resources,
}: {
  resources: (typeof resource.$inferSelect)[];
}) {
  return (
    <Card className="flex-1 min-h-0">
      <Card.Header>
        <div className="flex items-center gap-2">
          <Folder className="text-muted size-4 shrink-0" />
          <Card.Title>Resources</Card.Title>
          <Chip size="sm" variant="soft">
            {resources.length}
          </Chip>
        </div>
      </Card.Header>
      <Card.Content className="min-h-0">
        {resources.length === 0 ? (
          <TableEmptyState />
        ) : (
          <ResourceTable items={resources} />
        )}
      </Card.Content>
    </Card>
  );
}
