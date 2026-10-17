import { ResourceService } from "@/services/resource";
import { Resource } from "@/models/api";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { use } from "react";
import { ResourceCard } from "./components/ResourceCard";

export default function ResourceDetailPage({
  params,
}: PageProps<"/resource/[id]">) {
  const { id } = use(params);
  const { success, data, error } = Resource.get.safeParse({ id });
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(ResourceService.get(data));
  if (result.isErr()) {
    console.log(result.error);
    notFound();
  }
  const item = result.value;
  if (!item) {
    notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <ResourceCard item={item} />
    </div>
  );
}
