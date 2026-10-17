"use server";

import { Summary } from "@/models/api";
import { SummaryService } from "@/services/summary";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function removeSummary(id: string): Promise<ActionResult<null>> {
  const { success, data, error } = Summary.delete.safeParse([id]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await SummaryService.remove(data);
  const ok = result.isOk();
  return ok
    ? {
        ok,
        data: result.value,
      }
    : {
        ok,
        error: result.error,
      };
}
