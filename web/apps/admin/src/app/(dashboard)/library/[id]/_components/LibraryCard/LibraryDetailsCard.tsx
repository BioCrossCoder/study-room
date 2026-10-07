"use client";

import type { library } from "@/models/orm";
import { removeLibrary } from "@/actions/library";
import { Button, Card, Link } from "@heroui/react";
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
        <div className="flex w-full items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Card.Title className="truncate text-lg">{item.name}</Card.Title>
            <Card.Description className="text-muted font-mono text-xs">
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
              <Pencil className="size-4" />
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
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-muted text-sm">URL</dt>
            <dd className="min-w-0 text-sm">
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
            </dd>
          </div>
          <div>
            <dt className="text-muted text-sm">Created</dt>
            <dd className="text-sm">
              {formatDateTime(item.createAt, timeZone)}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-sm">Updated</dt>
            <dd className="text-sm">
              {formatDateTime(item.updateAt, timeZone)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted text-sm">Description</dt>
            <dd className="text-sm whitespace-pre-wrap">{item.description}</dd>
          </div>
        </dl>
      </Card.Content>
    </Card>
  );
}
