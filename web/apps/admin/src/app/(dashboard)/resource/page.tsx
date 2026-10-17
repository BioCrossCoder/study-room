import { getLibraryNames } from "@/actions/library";
import { ResourceService } from "@/services/resource";
import { use } from "react";
import { Resource } from "@/models/api";
import type { TimestampFields } from "@/models/types";
import { readListQuery } from "@/common/filter";
import { applyListDefaults } from "@/common/list";
import { autoRedirectOnDemand } from "@/common/utils";
import { notFound } from "next/navigation";
import { prettifyError, type z } from "zod";
import { CreateButton } from "../components/CreateButton";
import { TableDateFilter } from "../../../components/TableDateFilter";
import { TableSearch } from "../../../components/TableSearch";
import { ResourceTable } from "./components/ResourceTable";

const FIELDS = [{ id: "name", label: "Name" }] as const;

type ResourceFilter = z.infer<typeof Resource.list>["filter"][number];

const DATE_FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
  { id: "lastVisit", label: "Last Visit" },
] as const satisfies TimestampFields<ResourceFilter>;

export default function ResourcePage({
  searchParams,
}: PageProps<"/resource"> & {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = use(searchParams);
  autoRedirectOnDemand("/resource", params, applyListDefaults);

  const { success, data, error } = Resource.list.safeParse(
    readListQuery(params),
  );
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(ResourceService.list(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }

  const { list, count } = result.value;
  const libraryIds = [
    ...new Set(
      list.flatMap((item) => (item.libraryId ? [item.libraryId] : [])),
    ),
  ];
  const names = use(getLibraryNames(libraryIds));
  if (!names.ok) {
    console.log(names.error);
  }
  const libraries = names.ok ? names.data : [];
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 h-full flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 justify-between @toolbar-md:flex-nowrap">
          <TableDateFilter fields={DATE_FIELDS} />
          <div className="flex w-full gap-3 @toolbar-md:w-auto">
            <TableSearch fields={FIELDS} />
            <CreateButton resource="resource" />
          </div>
        </div>
        <ResourceTable items={list} count={count} libraries={libraries} />
      </div>
    </div>
  );
}
