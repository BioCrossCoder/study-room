"use client";

import type { UIEvent } from "react";
import { listLibraryOptions } from "@/actions/library";
import {
  Button,
  ListBox,
  Popover,
  SearchField,
  Spinner,
  toast,
} from "@heroui/react";
import {
  Check,
  ChevronDown,
  Filter,
  ListChecks,
  RefreshCw,
} from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

type SelectOption = {
  id: string;
  label: string;
};

const ALL = "all";
const NONE = "";
const LABEL = "Library";
const PAGE_SIZE = 10;
const SEARCH_DELAY = 300;
const BOTTOM_THRESHOLD = 32;

export function LibraryFilter({
  selectionMode,
  name,
  value = [],
  className,
  onApply,
}: {
  selectionMode: "single" | "multiple";
  name?: string;
  value?: readonly string[];
  className?: string;
  onApply?: (ids: readonly string[]) => void;
}) {
  const single = selectionMode === "single";
  const [draft, setDraft] = useState<string[]>(() =>
    single ? [] : [...value],
  );
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const requestRef = useRef(0);

  const load = async (nextKeyword: string, nextPage: number) => {
    const request = (requestRef.current += 1);
    setIsLoading(true);
    const result = await listLibraryOptions(nextKeyword, nextPage, PAGE_SIZE);
    if (request !== requestRef.current) {
      return;
    }
    setIsLoading(false);
    if (!result.ok) {
      setFailed(true);
      toast.danger("Failed to load libraries", {
        description: result.error.message,
      });
      return;
    }
    setFailed(false);
    const items = result.data.list.map(({ id, name }) => ({
      id,
      label: name,
    }));
    setOptions((prev) => (nextPage === 1 ? items : [...prev, ...items]));
    setCount(result.data.count);
    setPage(nextPage);
    setLoaded(true);
  };

  const search = useEffectEvent((nextKeyword: string) => {
    load(nextKeyword, 1);
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const timer = setTimeout(() => search(keyword), SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [isOpen, keyword]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    if (isLoading || options.length >= count) {
      return;
    }
    if (scrollHeight - scrollTop - clientHeight < BOTTOM_THRESHOLD) {
      load(keyword, page + 1);
    }
  };

  const applySelection = (keys: "all" | Iterable<string | number>) => {
    if (single) {
      const [key] = keys === "all" ? [] : [...keys];
      setDraft(key === undefined || key === NONE ? [] : [String(key)]);
      setIsOpen(false);
      return;
    }
    if (keys === "all") {
      setDraft(options.map((option) => option.id));
      return;
    }
    const selected = new Set([...keys].map(String));
    if (selected.has(ALL) && draft.length > 0) {
      setDraft([]);
      return;
    }
    setDraft([...selected].filter((key) => key !== ALL));
  };

  const submit = () => {
    onApply?.(draft);
    setIsOpen(false);
  };

  const selectedLabel = single
    ? (options.find((option) => option.id === draft[0])?.label ?? null)
    : null;

  const popover = (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          if (!single) {
            setDraft([...value]);
          }
          setKeyword("");
        }
        setIsOpen(open);
      }}
    >
      {single ? (
        <Button
          variant="ghost"
          aria-label={LABEL}
          className="rounded-field! border bg-field text-field-foreground shadow-field [--field-background:var(--surface-secondary)] w-full! justify-between! px-3! py-2! text-sm!"
        >
          <span className="min-w-0 truncate">{selectedLabel ?? "None"}</span>
          <ChevronDown className="size-4 shrink-0" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-inherit w-full! justify-start! text-xs hover:bg-transparent"
        >
          {LABEL}
          <Filter
            className={
              value.length > 0 ? "text-accent size-2.5" : "text-muted size-2.5"
            }
          />
        </Button>
      )}
      <Popover.Content className="w-64">
        <Popover.Dialog className="flex flex-col gap-1">
          <SearchField
            aria-label="Search libraries"
            value={keyword}
            onChange={(next) => setKeyword(next ?? "")}
          >
            <SearchField.Group className="w-full min-w-0 gap-1 pe-1">
              <SearchField.Input
                placeholder="Search libraries"
                className="min-w-0 px-2 text-sm"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <div
            className="-me-1.5 max-h-72 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--scrollbar-thumb) [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            onScroll={handleScroll}
          >
            <ListBox
              aria-label="Library options"
              selectionMode={single ? "single" : "multiple"}
              escapeKeyBehavior="none"
              selectedKeys={draft.length > 0 ? draft : [single ? NONE : ALL]}
              onSelectionChange={applySelection}
            >
              <ListBox.Item
                id={single ? NONE : ALL}
                textValue={single ? "None" : "All"}
                className="pe-9"
              >
                {single ? null : <ListChecks aria-hidden className="size-4" />}
                {single ? "None" : "All"}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {options.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                  className="pe-9"
                >
                  <span className="block min-w-0 truncate">{option.label}</span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted flex items-center gap-1 px-1 text-xs">
              {isLoading ? <Spinner size="sm" /> : null}
              {failed ? (
                <span className="text-danger">Failed to load</span>
              ) : loaded ? (
                count > 0 ? (
                  `${count} Libraries`
                ) : (
                  "No libraries"
                )
              ) : null}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              {failed ? (
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  aria-label="Retry loading libraries"
                  onPress={() => load(keyword, page || 1)}
                >
                  <RefreshCw />
                </Button>
              ) : null}
              {single ? null : (
                <Button
                  isIconOnly
                  size="sm"
                  variant="primary"
                  aria-label="Apply library filter"
                  onPress={submit}
                >
                  <Check />
                </Button>
              )}
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );

  return single ? (
    <div className={className}>
      <div className="flex flex-col gap-1">
        <span className="text-muted text-sm">{LABEL}</span>
        {popover}
        {name ? (
          <input type="hidden" name={name} value={draft[0] ?? NONE} />
        ) : null}
      </div>
    </div>
  ) : (
    popover
  );
}
