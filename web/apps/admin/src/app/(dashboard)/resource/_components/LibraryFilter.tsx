"use client";

import type { SelectOption } from "./types";
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
import { Check, Filter, ListChecks } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const ALL = "all";
const PAGE_SIZE = 100;
const SEARCH_DELAY = 300;
const BOTTOM_THRESHOLD = 32;

export function LibraryFilter({
  value,
  onApply,
}: {
  value: readonly string[];
  onApply: (ids: readonly string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>([...value]);
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      toast.danger("Failed to load libraries", {
        description: result.error.message,
      });
      return;
    }
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

  const selectLibraries = (keys: "all" | Iterable<string | number>) => {
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
    onApply(draft);
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setDraft([...value]);
          setKeyword("");
        }
        setIsOpen(open);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-inherit w-full! justify-start! text-xs hover:bg-transparent"
      >
        Library
        <Filter
          className={
            value.length > 0 ? "text-accent size-2.5" : "text-muted size-2.5"
          }
        />
      </Button>
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
          <div className="max-h-72 overflow-y-auto" onScroll={handleScroll}>
            <ListBox
              aria-label="Filter by library"
              selectionMode="multiple"
              escapeKeyBehavior="none"
              selectedKeys={draft.length > 0 ? draft : [ALL]}
              onSelectionChange={selectLibraries}
            >
              <ListBox.Item id={ALL} textValue="All" className="pe-9">
                <ListChecks aria-hidden className="size-4" />
                All
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
              {loaded
                ? count > 0
                  ? `${count} Libraries`
                  : "No libraries"
                : null}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="primary"
              className="shrink-0"
              aria-label="Apply library filter"
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
