import { AnnotationService } from "@/services/annotation";
import { Annotation } from "@/models/api";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { AnnotationDetailsCard } from "./_components/AnnotationDetailsCard";
import { use } from "react";

export default function AnnotationDetailPage({
  params,
}: PageProps<"/annotation/[id]">) {
  const { id } = use(params);
  const { success, data, error } = Annotation.get.safeParse({ id });
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(AnnotationService.get(data));
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
      <AnnotationDetailsCard item={item} />
    </div>
  );
}
