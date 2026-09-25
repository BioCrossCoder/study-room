"use server";

import { Bookmark } from "@/models/api";
import { BookmarkService } from "@/services/bookmark";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function createBookmark(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<string[]>> {
  const param = {
    ...Object.fromEntries(form.entries()),
    offset: Number(form.get("offset")),
  };
  const { success, data, error } = Bookmark.create.safeParse([param]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await BookmarkService.create(data);
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

export async function updateBookmark(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<null>> {
  const param = {
    ...Object.fromEntries(form.entries()),
    offset: Number(form.get("offset")),
  };
  const { success, data, error } = Bookmark.update.safeParse(param);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await BookmarkService.update(data);
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

export async function removeBookmark(
  id: string,
): Promise<ActionResult<null>> {
  const { success, data, error } = Bookmark.delete.safeParse([id]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await BookmarkService.remove(data);
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
