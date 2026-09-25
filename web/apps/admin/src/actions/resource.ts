"use server";

import { Resource } from "@/models/api";
import { ResourceService } from "@/services/resource";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function createResource(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<string[]>> {
  const param = {
    ...Object.fromEntries(form.entries()),
    libraryId: form.get("libraryId") || null,
    bookmarkId: form.get("bookmarkId") || null,
  };
  const { success, data, error } = Resource.create.safeParse([param]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await ResourceService.create(data);
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

export async function updateResource(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<null>> {
  const param = {
    ...Object.fromEntries(form.entries()),
    libraryId: form.get("libraryId") || null,
    bookmarkId: form.get("bookmarkId") || null,
  };
  const { success, data, error } = Resource.update.safeParse(param);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await ResourceService.update(data);
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

export async function removeResource(
  id: string,
): Promise<ActionResult<null>> {
  const { success, data, error } = Resource.delete.safeParse([id]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await ResourceService.remove(data);
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
