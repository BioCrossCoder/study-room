import { LibraryService } from "@/services/library";
import { use } from "react";
import { Library } from "@/models/api";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { CreateButton } from "../_components/CreateButton";
import { PaginationNav } from "../_components/PaginationNav";
import { TableDateFilter } from "../_components/TableDateFilter";
import { TableEmptyState } from "../_components/TableEmptyState";
import { TableSearch } from "../_components/TableSearch";
import { LibraryTable } from "./_components/LibraryTable";

const FIELDS = [{ id: "name", label: "Name" }] as const;

export default function LibraryPage({
  searchParams,
}: PageProps<"/library"> & {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = use(searchParams);
  autoRedirectOnDemand("/library", params, (params, query) => {
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

  const { success, data, error } = Library.list.safeParse({
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

  const result = use(LibraryService.list(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }

  const { list, count } = result.value;
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 h-full flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 justify-between">
          <TableDateFilter />
          <div className="flex w-full gap-3 lg:w-auto">
            <TableSearch fields={FIELDS} />
            <CreateButton resource="library" />
          </div>
        </div>
        {list.length === 0 ? (
          <TableEmptyState resource="library" />
        ) : (
          <LibraryTable items={list} />
        )}
      </div>
      <PaginationNav count={count} />
    </div>
  );
}
