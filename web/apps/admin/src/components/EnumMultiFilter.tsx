"use client";

import { Button, ListBox, Popover } from "@heroui/react";
import { Check, Filter, ListChecks } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const ALL = "all";

function normalizeDraft(values: readonly string[], options: readonly string[]) {
  return values.length === options.length ? [ALL, ...options] : [...values];
}

function resolveDraft(
  keys: "all" | Iterable<string | number>,
  current: readonly string[],
  options: readonly string[],
) {
  const all = [ALL, ...options];
  if (keys === "all") {
    return all;
  }
  const selected = new Set([...keys].map(String));
  const hasAll = selected.has(ALL);
  if (hasAll !== current.includes(ALL)) {
    return hasAll ? all : [];
  }
  const picked = options.filter((option) => selected.has(option));
  return picked.length === options.length ? all : picked;
}

export function EnumMultiFilter<T extends string>({
  label,
  options,
  value,
  renderOption,
  onApply,
}: {
  label: string;
  options: readonly T[];
  value: readonly T[];
  renderOption?: (option: T) => ReactNode;
  onApply: (values: readonly T[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>(() =>
    normalizeDraft(value, options),
  );
  const [isOpen, setIsOpen] = useState(false);

  const submit = () => {
    onApply(draft.filter((item) => item !== ALL) as T[]);
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setDraft(normalizeDraft(value, options));
        }
        setIsOpen(open);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-inherit w-full! text-xs hover:bg-transparent"
      >
        {label}
        <Filter
          className={
            value.length < options.length
              ? "text-accent size-2.5"
              : "text-muted size-2.5"
          }
        />
      </Button>
      <Popover.Content className="w-40">
        <Popover.Dialog className="flex flex-col gap-1">
          <ListBox
            aria-label={`Filter by ${label.toLowerCase()}`}
            selectionMode="multiple"
            escapeKeyBehavior="none"
            selectedKeys={draft}
            onSelectionChange={(keys) =>
              setDraft(resolveDraft(keys, draft, options))
            }
          >
            <ListBox.Item id={ALL} textValue="All" className="pe-9">
              <ListChecks aria-hidden className="size-4" />
              All
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {options.map((option) => (
              <ListBox.Item
                key={option}
                id={option}
                textValue={option}
                className="pe-9"
              >
                {renderOption?.(option)}
                {option}
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
              aria-label={`Apply ${label.toLowerCase()} filter`}
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
