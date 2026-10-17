import { AnnotationService } from "@/services/annotation";
import { use } from "react";
import { Annotation } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { readListQuery } from "@/common/filter";
import { applyListDefaults } from "@/common/list";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { TableDateFilter } from "../../../components/TableDateFilter";
import { AnnotationTable } from "./components/AnnotationTable";

type AnnotationFilter = z.infer<typeof Annotation.list>["filter"][number];

const DATE_FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
] as const satisfies TimestampFields<AnnotationFilter>;

export default function AnnotationPage({
  searchParams,
}: PageProps<"/annotation"> & {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = use(searchParams);
  autoRedirectOnDemand("/annotation", params, applyListDefaults);

  const { success, data, error } = Annotation.list.safeParse(
    readListQuery(params),
  );
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(AnnotationService.list(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }

  const { list, count } = result.value;
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 h-full flex flex-col gap-3">
        <TableDateFilter fields={DATE_FIELDS} />
        <AnnotationTable items={list} count={count} />
      </div>
    </div>
  );
}
