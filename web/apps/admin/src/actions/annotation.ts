"use server";

import { Annotation } from "@/models/api";
import { AnnotationService } from "@/services/annotation";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function removeAnnotation(
  id: string,
): Promise<ActionResult<null>> {
  const { success, data, error } = Annotation.delete.safeParse([id]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await AnnotationService.remove(data);
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
