import { BookmarkService } from "@/services/bookmark";
import { use } from "react";
import { Bookmark } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { PaginationNav } from "../_components/PaginationNav";
import { TableDateFilter } from "../_components/TableDateFilter";
import { TableSearch } from "../_components/TableSearch";
import { BookmarkTable } from "./_components/BookmarkTable";

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
  autoRedirectOnDemand("/bookmark", params, (params, query) => {
    let redirect = false;
    if (!params.sort) {
      query.set(
        "sort",
        JSON.stringify([
          { field: "createAt", direction: "desc" },
          { field: "id", direction: "desc" },
        ]),
      );
      redirect = true;
    }
    if (!params.page) {
      query.set("page", "1");
      redirect = true;
    }
    if (!params.size) {
      query.set("size", "20");
      redirect = true;
    }
    return redirect;
  });

  const { success, data, error } = Bookmark.list.safeParse({
    filter: JSON.parse(params.filter ?? "[]"),
    sort: JSON.parse(params.sort ?? "[]"),
    pagination: {
      page: Number.parseInt(params.page as string),
      size: Number.parseInt(params.size as string),
    },
  });
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
        <div className="flex flex-wrap gap-3 justify-between">
          <TableDateFilter fields={DATE_FIELDS} />
          <TableSearch fields={FIELDS} />
        </div>
        <BookmarkTable items={list} />
      </div>
      <PaginationNav count={count} />
    </div>
  );
}
