import { BookmarkService } from "@/services/bookmark";
import { use } from "react";
import { Bookmark } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { readListQuery } from "@/common/filter";
import { applyListDefaults } from "@/common/list";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { TableDateFilter } from "../../../components/TableDateFilter";
import { TableSearch } from "../../../components/TableSearch";
import { BookmarkTable } from "./components/BookmarkTable";

const FIELDS = [{ id: "url", label: "URL" }] as const;

type BookmarkFilter = z.infer<typeof Bookmark.list>["filter"][number];

const DATE_FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
] as const satisfies TimestampFields<BookmarkFilter>;

export default function BookmarkPage({
  searchParams,
}: PageProps<"/bookmark"> & {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = use(searchParams);
  autoRedirectOnDemand("/bookmark", params, applyListDefaults);

  const { success, data, error } = Bookmark.list.safeParse(
    readListQuery(params),
  );
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(BookmarkService.list(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }

  const { list, count } = result.value;
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 h-full flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 justify-between @toolbar-md:flex-nowrap">
          <TableDateFilter fields={DATE_FIELDS} />
          <TableSearch fields={FIELDS} />
        </div>
        <BookmarkTable items={list} count={count} />
      </div>
    </div>
  );
}
