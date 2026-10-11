import { SummaryService } from "@/services/summary";
import { Summary } from "@/models/api";
import { notFound } from "next/navigation";
import { prettifyError } from "zod";
import { SummaryDetailsCard } from "./_components/SummaryDetailsCard";
import { use } from "react";

export default function SummaryDetailPage({
  params,
}: PageProps<"/summary/[id]">) {
  const { id } = use(params);
  const { success, data, error } = Summary.get.safeParse({ id });
  if (!success) {
    console.log(prettifyError(error));
    notFound();
  }

  const result = use(SummaryService.get(data));
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
      <SummaryDetailsCard item={item} />
    </div>
  );
}
