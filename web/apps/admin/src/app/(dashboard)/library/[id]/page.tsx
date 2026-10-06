import { LibraryService } from "@/services/library";
import { Library } from "@/models/api";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { LibraryCard } from "./_components/LibraryCard";
import { ResourcesCard } from "./_components/ResourcesCard";
import { use } from "react";

export default function LibraryDetailPage({
  params,
}: PageProps<"/library/[id]">) {
  const { id } = use(params);
  const { success, data, error } = Library.get.safeParse({ id });
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(LibraryService.get(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }
  const item = result.value;
  if (!item) {
    notFound();
  }

  const { resources } = item;
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <LibraryCard item={item} />
      <ResourcesCard resources={resources} />
    </div>
  );
}
