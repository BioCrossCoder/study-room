"use server";

import { Annotation } from "@/models/api";
import { AnnotationService } from "@/services/annotation";
import type { ActionResult } from "./utils";
import { prettifyError } from "zod";

export async function createAnnotation(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<string[]>> {
  const param = {
    ...Object.fromEntries(form.entries()),
    startOffset: Number(form.get("startOffset")),
    endOffset: Number(form.get("endOffset")),
  };
  const { success, data, error } = Annotation.create.safeParse([param]);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await AnnotationService.create(data);
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

export async function updateAnnotation(
  _prevState: unknown,
  form: FormData,
): Promise<ActionResult<null>> {
  const param = Object.fromEntries(form.entries());
  const { success, data, error } = Annotation.update.safeParse(param);
  if (!success) {
    return {
      ok: false,
      error: new Error(prettifyError(error)),
    };
  }
  const result = await AnnotationService.update(data);
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
