"use client";

import { Button, FieldError, Popover, SearchField } from "@heroui/react";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const URL_FILTER = z.url().optional();

export function UrlFilter({
  value,
  onApply,
}: {
  value: string;
  onApply: (url: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const submit = () => {
    const next = draft.trim();
    const parsed = URL_FILTER.safeParse(next || undefined);
    if (!parsed.success) {
      setError("Enter a valid URL");
      return;
    }
    setError(null);
    onApply(next);
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setDraft(value);
          setError(null);
        }
        setIsOpen(open);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-inherit w-full! justify-start! text-xs hover:bg-transparent"
      >
        URL
        <Filter
          className={value ? "text-accent size-2.5" : "text-muted size-2.5"}
        />
      </Button>
      <Popover.Content className="w-72">
        <Popover.Dialog>
          <SearchField
            aria-label="Filter by URL"
            isInvalid={error !== null}
            value={draft}
            onChange={(next) => {
              setDraft(next ?? "");
              setError(null);
            }}
            onSubmit={submit}
          >
            <SearchField.Group className="w-full min-w-0 gap-1 pe-1">
              <SearchField.Input
                placeholder="Filter by URL"
                className="min-w-0 px-2 text-sm"
              />
              <SearchField.ClearButton />
              <Button
                type="button"
                slot={null}
                excludeFromTabOrder={false}
                preventFocusOnPress={false}
                size="sm"
                variant="primary"
                isIconOnly
                className="shrink-0"
                aria-label="Apply URL filter"
                onPress={submit}
              >
                <Search />
              </Button>
            </SearchField.Group>
            <FieldError>{error}</FieldError>
          </SearchField>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
