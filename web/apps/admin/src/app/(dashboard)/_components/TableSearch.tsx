"use client";

import { parseFilterParam } from "@/common/filter";
import { Button, ListBox, SearchField, Select } from "@heroui/react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function TableSearch<T extends string>({
  fields,
  keyword,
  setKeyword,
}: {
  fields: readonly { id: T; label: string }[];
  keyword: string;
  setKeyword: (keyword: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [field, setField] = useState<T>(fields[0].id);

  const search = (value: string) => {
    const query = new URLSearchParams(searchParams);
    const filter = {
      ...parseFilterParam(query.get("filter")),
      [field]: value || undefined,
    };
    query.set("filter", JSON.stringify([filter]));
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  return (
    <SearchField
      className="w-full min-w-0 lg:w-auto lg:flex-none"
      value={keyword}
      onChange={(value) => setKeyword(value ?? "")}
      onSubmit={(value) => {
        setKeyword(value ?? "");
        search(value ?? "");
      }}
      onClear={() => search("")}
    >
      <SearchField.Group className="w-full min-w-0 gap-1 pe-1 lg:w-auto">
        <Select
          className="w-24 shrink-0 sm:w-28 lg:w-auto"
          selectionMode="single"
          value={field}
          onChange={(key) => setField(key as T)}
        >
          <Select.Trigger>
            <Select.Value className="text-sm" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {fields.map((item) => (
                <ListBox.Item
                  key={item.id}
                  id={item.id}
                  textValue={item.label}
                  className="pe-9"
                >
                  {item.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <SearchField.Input
          placeholder="Search"
          className="min-w-0 flex-1 px-2 text-sm"
        />
        <SearchField.ClearButton />
        <Button
          type="button"
          slot={null}
          onPress={() => search(keyword)}
          excludeFromTabOrder={false}
          preventFocusOnPress={false}
          size="sm"
          variant="primary"
          isIconOnly
          aria-label="Search"
          className="shrink-0"
        >
          <Search />
        </Button>
      </SearchField.Group>
    </SearchField>
  );
}
