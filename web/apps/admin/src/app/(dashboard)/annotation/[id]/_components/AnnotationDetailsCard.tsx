"use client";

import type { annotation } from "@/models/orm";
import { removeAnnotation } from "@/actions/annotation";
import { Card, Description, Link, Typography } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { DeleteButton } from "@/app/(dashboard)/_components/DeleteButton";

export function AnnotationDetailsCard({
  item,
}: {
  item: typeof annotation.$inferSelect;
}) {
  const timeZone = useTimeZone();
  return (
    <Card>
      <Card.Header>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Card.Title className="min-w-0 text-lg">
              <Link
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex max-w-full min-w-0 items-center gap-1"
              >
                <Link.Icon className="size-4 shrink-0">
                  <ExternalLink className="size-full" />
                </Link.Icon>
                <span className="min-w-0 wrap-break-word">{item.url}</span>
              </Link>
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
              onDelete={removeAnnotation}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-3 @2xl:grid-cols-2 @7xl:grid-cols-4">
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
