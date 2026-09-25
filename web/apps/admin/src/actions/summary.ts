"use server";

import { Summary } from "@/models/api";
import { SummaryService } from "@/services/summary";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function createSummary(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<string[]>> {
  const param = Object.fromEntries(form.entries());
  const { success, data, error } = Summary.create.safeParse([param]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await SummaryService.create(data);
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

export async function updateSummary(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<null>> {
  const param = Object.fromEntries(form.entries());
  const { success, data, error } = Summary.update.safeParse(param);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await SummaryService.update(data);
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

export async function removeSummary(
  id: string,
): Promise<ActionResult<null>> {
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
