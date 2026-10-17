"use client";

import type { library } from "@/models/orm";
import { removeLibrary } from "@/actions/library";
import { DeleteButton } from "@/app/(dashboard)/components/DeleteButton";
import { Button, Card, Description, Typography } from "@heroui/react";
import { Pencil } from "lucide-react";
import { DateField } from "@/components/DateField";
import { LinkField } from "@/components/LinkField";

export function LibraryDetailsCard({
  item,
  onEdit,
}: {
  item: typeof library.$inferSelect;
  onEdit: () => void;
}) {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Card.Title className="text-lg wrap-break-word">
              {item.name}
            </Card.Title>
            <Card.Description className="font-mono text-xs">
              {item.id}
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="bg-surface-secondary hover:bg-surface-tertiary size-8"
              aria-label="Edit library"
              onPress={onEdit}
            >
              <Pencil />
            </Button>
            <DeleteButton
              id={item.id}
              name={item.name}
              resource="library"
              redirectTo="/library"
              onDelete={removeLibrary}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-3 @2xl:grid-cols-2 @7xl:grid-cols-4">
          <div className="min-w-0 @2xl:col-span-2">
            <Description>URL</Description>
            <Typography.Paragraph size="sm">
              <LinkField href={item.url} external>
                {item.url}
              </LinkField>
            </Typography.Paragraph>
          </div>
          <div>
            <Description>Created</Description>
            <Typography.Paragraph size="sm">
              <DateField value={item.createAt} />
            </Typography.Paragraph>
          </div>
          <div>
            <Description>Updated</Description>
            <Typography.Paragraph size="sm">
              <DateField value={item.updateAt} />
            </Typography.Paragraph>
          </div>
          <div className="@2xl:col-span-2 @7xl:col-span-4">
            <Description>Description</Description>
            <Typography.Paragraph size="sm" className="whitespace-pre-wrap">
              {item.description}
            </Typography.Paragraph>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
