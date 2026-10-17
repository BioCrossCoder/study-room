"use server";

import { Bookmark } from "@/models/api";
import { BookmarkService } from "@/services/bookmark";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function removeBookmark(id: string): Promise<ActionResult<null>> {
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
