"use client";

import { removeResource } from "@/actions/resource";
import { DeleteButton } from "@/app/(dashboard)/components/DeleteButton";
import { Button, Card, Description, Typography } from "@heroui/react";
import { Pencil } from "lucide-react";
import { DateField } from "@/components/DateField";
import { LinkField } from "@/components/LinkField";
import type { ResourceDetail } from "./types";
import { safeWrap } from "@/common/utils";

export function ResourceDetailsCard({
  item,
  onEdit,
}: {
  item: ResourceDetail;
  onEdit: () => void;
}) {
  const deleteResource = safeWrap(removeResource, "Failed to delete resource");

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
              aria-label="Edit resource"
              onPress={onEdit}
            >
              <Pencil />
            </Button>
            <DeleteButton
              id={item.id}
              name={item.name}
              resource="resource"
              redirectTo="/resource"
              onDelete={deleteResource}
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
          <div className="min-w-0">
            <Description>Library</Description>
            {item.library ? (
              <Typography.Paragraph size="sm">
                <LinkField href={`/library/${item.library.id}`}>
                  {item.library.name}
                </LinkField>
              </Typography.Paragraph>
            ) : (
              <Typography.Paragraph size="sm" color="muted">
                -
              </Typography.Paragraph>
            )}
          </div>
          <div>
            <Description>Last Visit</Description>
            <Typography.Paragraph size="sm">
              <DateField value={item.lastVisit} />
            </Typography.Paragraph>
          </div>
          <div className="min-w-0 @2xl:col-span-2">
            <Description>Bookmark</Description>
            {item.bookmark ? (
              <Typography.Paragraph size="sm" className="font-mono">
                <LinkField href={`/bookmark/${item.bookmark.id}`}>
                  {item.bookmark.id}
                </LinkField>
              </Typography.Paragraph>
            ) : (
              <Typography.Paragraph size="sm" color="muted">
                -
              </Typography.Paragraph>
            )}
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
