"use client";

import type { library } from "@/models/orm";
import { removeLibrary } from "@/actions/library";
import { Button, Card, Description, Link, Typography } from "@heroui/react";
import { ExternalLink, Pencil } from "lucide-react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { DeleteButton } from "@/app/(dashboard)/_components/DeleteButton";

export function LibraryDetailsCard({
  item,
  onEdit,
}: {
  item: typeof library.$inferSelect;
  onEdit: () => void;
}) {
  const timeZone = useTimeZone();
  return (
    <Card>
      <Card.Header>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Card.Title className="truncate text-lg">{item.name}</Card.Title>
            <Card.Description className="font-mono text-xs">
              {item.id}
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="bg-surface-secondary hover:bg-surface-tertiary"
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <Description>URL</Description>
            <Typography.Paragraph size="sm">
              <Link
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex w-full min-w-0 gap-1"
              >
                <Link.Icon>
                  <ExternalLink className="size-3.5" />
                </Link.Icon>
                <span className="min-w-0 flex-1 truncate">{item.url}</span>
              </Link>
            </Typography.Paragraph>
          </div>
          <div>
            <Description>Created</Description>
            <Typography.Paragraph size="sm">
              {formatDateTime(item.createAt, timeZone)}
            </Typography.Paragraph>
          </div>
          <div>
            <Description>Updated</Description>
            <Typography.Paragraph size="sm">
              {formatDateTime(item.updateAt, timeZone)}
            </Typography.Paragraph>
          </div>
          <div className="sm:col-span-2">
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
