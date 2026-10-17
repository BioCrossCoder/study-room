import { SummaryService } from "@/services/summary";
import { use } from "react";
import { Summary } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { readListQuery } from "@/common/filter";
import { applyListDefaults } from "@/common/list";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { TableDateFilter } from "../../../components/TableDateFilter";
import { TableSearch } from "../../../components/TableSearch";
import { SummaryTable } from "./components/SummaryTable";

const FIELDS = [{ id: "url", label: "URL" }] as const;

type SummaryFilter = z.infer<typeof Summary.list>["filter"][number];

const DATE_FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
] as const satisfies TimestampFields<SummaryFilter>;

export default function SummaryPage({
  searchParams,
}: PageProps<"/summary"> & {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = use(searchParams);
  autoRedirectOnDemand("/summary", params, applyListDefaults);

  const { success, data, error } = Summary.list.safeParse(
    readListQuery(params),
  );
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(SummaryService.list(data));
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
        <SummaryTable items={list} count={count} />
      </div>
    </div>
  );
}
