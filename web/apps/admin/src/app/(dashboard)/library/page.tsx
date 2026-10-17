import { LibraryService } from "@/services/library";
import { use } from "react";
import { Library } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { readListQuery } from "@/common/filter";
import { applyListDefaults } from "@/common/list";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { CreateButton } from "../components/CreateButton";
import { TableDateFilter } from "../../../components/TableDateFilter";
import { TableSearch } from "../../../components/TableSearch";
import { LibraryTable } from "./components/LibraryTable";

const FIELDS = [{ id: "name", label: "Name" }] as const;

type LibraryFilter = z.infer<typeof Library.list>["filter"][number];

const DATE_FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
] as const satisfies TimestampFields<LibraryFilter>;

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
  autoRedirectOnDemand("/library", params, applyListDefaults);

  const { success, data, error } = Library.list.safeParse(
    readListQuery(params),
  );
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
        <div className="flex flex-wrap gap-3 justify-between @toolbar-md:flex-nowrap">
          <TableDateFilter fields={DATE_FIELDS} />
          <div className="flex w-full gap-3 @toolbar-md:w-auto">
            <TableSearch fields={FIELDS} />
            <CreateButton resource="library" />
          </div>
        </div>
        <LibraryTable items={list} count={count} />
      </div>
    </div>
  );
}
