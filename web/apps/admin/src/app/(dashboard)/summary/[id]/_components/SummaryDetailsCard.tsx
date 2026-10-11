"use client";

import type { summary } from "@/models/orm";
import { removeSummary } from "@/actions/summary";
import { Card, Description, Link, Typography } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { DeleteButton } from "@/app/(dashboard)/_components/DeleteButton";

export function SummaryDetailsCard({
  item,
}: {
  item: typeof summary.$inferSelect;
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
                className="flex min-w-0 items-center gap-1"
              >
                <Link.Icon className="size-4 shrink-0">
                  <ExternalLink className="size-full" />
                </Link.Icon>
                <span className="min-w-0 truncate">{item.url}</span>
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
              resource="summary"
              redirectTo="/summary"
              onDelete={removeSummary}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="sm:col-span-2 xl:col-span-4">
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
