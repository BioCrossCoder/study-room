import { BookmarkService } from "@/services/bookmark";
import { Bookmark } from "@/models/api";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { BookmarkDetailsCard } from "./_components/BookmarkCard/BookmarkDetailsCard";
import { ResourcesCard } from "@/app/(dashboard)/_components/ResourcesCard";
import { use } from "react";

export default function BookmarkDetailPage({
  params,
}: PageProps<"/bookmark/[id]">) {
  const { id } = use(params);
  const { success, data, error } = Bookmark.get.safeParse({ id });
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(BookmarkService.get(data));
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
      <BookmarkDetailsCard item={item} />
      <ResourcesCard resources={resources} />
    </div>
  );
}
