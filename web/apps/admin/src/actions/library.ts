"use server";

import { Library } from "@/models/api";
import { LibraryService } from "@/services/library";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function createLibrary(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<string[]>> {
  const param = Object.fromEntries(form.entries());
  const { success, data, error } = Library.create.safeParse([param]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await LibraryService.create(data);
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

export async function updateLibrary(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<null>> {
  const param = Object.fromEntries(form.entries());
  const { success, data, error } = Library.update.safeParse(param);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await LibraryService.update(data);
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

export async function removeLibrary(id: string): Promise<ActionResult<null>> {
  const { success, data, error } = Library.delete.safeParse([id]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await LibraryService.remove(data);
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
