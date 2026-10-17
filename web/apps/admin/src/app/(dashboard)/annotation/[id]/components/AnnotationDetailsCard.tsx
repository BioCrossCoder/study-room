"use client";

import type { annotation } from "@/models/orm";
import { removeAnnotation } from "@/actions/annotation";
import { DeleteButton } from "@/app/(dashboard)/components/DeleteButton";
import { Card, Description, Typography } from "@heroui/react";
import { DateField } from "@/components/DateField";
import { LinkField } from "@/components/LinkField";
import { safeWrap } from "@/common/utils";

export function AnnotationDetailsCard({
  item,
}: {
  item: typeof annotation.$inferSelect;
}) {
  const deleteAnnotation = safeWrap(
    removeAnnotation,
    "Failed to delete annotation",
  );

  return (
    <Card>
      <Card.Header>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Card.Title className="min-w-0 text-lg">
              <LinkField href={item.url} external>
                {item.url}
              </LinkField>
            </Card.Title>
            <Card.Description className="font-mono text-xs">
              {item.id}
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <DeleteButton
              id={item.id}
              name={item.id}
              resource="annotation"
              redirectTo="/annotation"
              onDelete={deleteAnnotation}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-3 @2xl:grid-cols-2 @7xl:grid-cols-4">
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
          <div>
            <Description>Type</Description>
            <Typography.Paragraph size="sm">{item.type}</Typography.Paragraph>
          </div>
          <div className="min-w-0 @2xl:col-span-2 @7xl:col-span-4">
            <div className="flex items-center gap-2">
              <Description>Path</Description>
              <Typography.Paragraph
                size="xs"
                color="muted"
                className="font-mono"
              >
                {"{start}#{startOffset}~{end}#{endOffset}"}
              </Typography.Paragraph>
            </div>
            <Typography.Paragraph
              size="sm"
              className="font-mono text-xs wrap-break-word whitespace-pre-wrap"
            >
              {`${item.start}#${item.startOffset}~${item.end}#${item.endOffset}`}
            </Typography.Paragraph>
          </div>
          <div className="@2xl:col-span-2 @7xl:col-span-4">
            <Description>Content</Description>
            <Typography.Paragraph size="sm" className="whitespace-pre-wrap">
              {item.content}
            </Typography.Paragraph>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
