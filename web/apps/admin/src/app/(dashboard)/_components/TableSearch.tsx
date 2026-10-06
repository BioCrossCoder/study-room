"use client";

import { patchFilter } from "@/common/filter";
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

  const search = () => {
    const query = new URLSearchParams(searchParams);
    patchFilter(query, { [field]: keyword || undefined });
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  return (
    <SearchField
      className="w-full sm:w-96"
      value={keyword}
      onChange={(value) => setKeyword(value ?? "")}
      onSubmit={search}
    >
      <SearchField.Group className="gap-1 pe-1">
        <Select
          className="shrink-0"
          selectionMode="single"
          value={field}
          onChange={(key) => setField(key as T)}
        >
          <Select.Trigger>
            <Select.Value />
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
        <SearchField.Input placeholder="Search" className="px-2" />
        <SearchField.ClearButton />
        <Button
          type="button"
          onPress={search}
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
