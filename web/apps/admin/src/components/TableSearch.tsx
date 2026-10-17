"use client";

import { useListQuery } from "@/hooks/useListQuery";
import { Button, ListBox, SearchField, Select } from "@heroui/react";
import { Search } from "lucide-react";
import { useState } from "react";

export function TableSearch<T extends string>({
  fields,
}: {
  fields: readonly { id: T; label: string }[];
}) {
  const { base, applyFilter } = useListQuery();
  const [field, setField] = useState<T>(fields[0].id);
  const [keyword, setKeyword] = useState(() => {
    const initial = base[fields[0].id];
    return typeof initial === "string" ? initial : "";
  });

  const search = (value: string) => {
    applyFilter([{ ...base, [field]: value || undefined }]);
  };

  return (
    <SearchField
      aria-label="Search"
      className="w-full min-w-0 @toolbar-md:w-64 @toolbar-md:flex-none"
      value={keyword}
      onChange={(value) => setKeyword(value ?? "")}
      onSubmit={(value) => {
        setKeyword(value ?? "");
        search(value ?? "");
      }}
      onClear={() => {
        setKeyword("");
        search("");
      }}
    >
      <SearchField.Group className="w-full min-w-0 gap-1 pe-1 @toolbar-md:w-auto">
        <Select
          aria-label="Search field"
          className="@max-toolbar-md:min-w-25 shrink-0"
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
          className="min-w-0 px-2 text-sm"
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
