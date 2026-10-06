import type { resource } from "@/models/orm";
import { Card, Chip } from "@heroui/react";
import { Folder } from "lucide-react";
import { ResourceTable } from "./ResourceTable";

export function ResourcesCard({
  resources,
}: {
  resources: (typeof resource.$inferSelect)[];
}) {
  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <Card.Header>
        <div className="flex items-center gap-2">
          <Folder className="text-muted size-4 shrink-0" />
          <Card.Title>Resources</Card.Title>
          <Chip size="sm" variant="soft">
            {resources.length}
          </Chip>
        </div>
      </Card.Header>
      <Card.Content className="flex min-h-0 flex-1 flex-col">
        {resources.length === 0 ? (
          <div className="text-muted flex flex-1 items-center justify-center py-6 text-sm">
            No resources in this library yet.
          </div>
        ) : (
          <ResourceTable items={resources} />
        )}
      </Card.Content>
    </Card>
  );
}
