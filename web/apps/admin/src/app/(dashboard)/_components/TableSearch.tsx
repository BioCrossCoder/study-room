"use client";

import { parseFilterParam } from "@/common/filter";
import { Button, ListBox, SearchField, Select } from "@heroui/react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function TableSearch<T extends string>({
  fields,
}: {
  fields: readonly { id: T; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [field, setField] = useState<T>(fields[0].id);
  const [keyword, setKeyword] = useState(
    () =>
      parseFilterParam<Record<string, string | undefined>>(
        searchParams.get("filter"),
      )[fields[0].id] ?? "",
  );

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
