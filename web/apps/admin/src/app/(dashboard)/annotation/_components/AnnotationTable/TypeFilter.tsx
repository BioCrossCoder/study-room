"use client";

import { annotationTypes } from "@/models/enums";
import { Button, ListBox, Popover } from "@heroui/react";
import { Check, Filter, ListChecks } from "lucide-react";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";

const ALL_TYPES = "all";
const TYPE_KEYS = [...annotationTypes];

function normalizeTypeDraft(types: readonly string[]): string[] {
  return types.length === TYPE_KEYS.length
    ? [ALL_TYPES, ...TYPE_KEYS]
    : [...types];
}

function resolveTypeDraft(
  keys: "all" | Iterable<string | number>,
  current: readonly string[],
): string[] {
  if (keys === "all") {
    return [ALL_TYPES, ...TYPE_KEYS];
  }
  const selected = new Set([...keys].map(String));
  const hasAll = selected.has(ALL_TYPES);
  if (hasAll !== current.includes(ALL_TYPES)) {
    return hasAll ? [ALL_TYPES, ...TYPE_KEYS] : [];
  }
  return normalizeTypeDraft(TYPE_KEYS.filter((type) => selected.has(type)));
}

export function TypeFilter({
  value,
  onApply,
}: {
  value: readonly string[];
  onApply: (types: readonly string[]) => void;
}) {
  const [draft, setDraft] = useState(normalizeTypeDraft(value));
  const [isOpen, setIsOpen] = useState(false);

  const submit = () => {
    onApply(draft.filter((type) => type !== ALL_TYPES));
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setDraft(normalizeTypeDraft(value));
        }
        setIsOpen(open);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-inherit w-full! text-xs hover:bg-transparent"
      >
        Type
        <Filter
          className={
            value.length < TYPE_KEYS.length
              ? "text-accent size-2.5"
              : "text-muted size-2.5"
          }
        />
      </Button>
      <Popover.Content className="w-40">
        <Popover.Dialog className="flex flex-col gap-1">
          <ListBox
            aria-label="Filter by type"
            selectionMode="multiple"
            escapeKeyBehavior="none"
            selectedKeys={draft}
            onSelectionChange={(keys) =>
              setDraft(resolveTypeDraft(keys, draft))
            }
          >
            <ListBox.Item id={ALL_TYPES} textValue="All" className="pe-9">
              <ListChecks aria-hidden className="size-4" />
              All
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {annotationTypes.map((type) => (
              <ListBox.Item
                key={type}
                id={type}
                textValue={type}
                className="pe-9"
              >
                <TypeIcon type={type} />
                {type}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
          <div className="flex justify-end">
            <Button
              isIconOnly
              size="sm"
              variant="primary"
              className="shrink-0"
              aria-label="Apply type filter"
              onPress={submit}
            >
              <Check />
            </Button>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
