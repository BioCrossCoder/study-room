import "server-only";

import type { WebMetadata } from "@/models/infra";
import { webMetadata } from "@/models/infra";
import { wrapError } from "common";
import type { Result } from "neverthrow";
import { err, ok, ResultAsync } from "neverthrow";
import z from "zod";

const ENDPOINT = "https://api.microlink.io";

const microLinkFailure = z.object({
  status: z.enum(["fail", "error"]),
  code: z.string().nullish(),
  message: z.string().nullish(),
  data: z.record(z.string(), z.string()).nullish(),
});

const microLinkResponse = z.union([
  z.object({
    status: z.literal("success"),
    data: webMetadata,
  }),
  microLinkFailure,
]);

export async function fetchWebsiteMetadata(
  url: string,
): Promise<Result<WebMetadata, Error>> {
  const response = await ResultAsync.fromPromise(
    fetch(`${ENDPOINT}?url=${encodeURIComponent(url)}`, { cache: "no-store" }),
    wrapError,
  );
  if (response.isErr()) {
    return err(response.error);
  }
  const body = await ResultAsync.fromPromise(response.value.json(), wrapError);
  if (body.isErr()) {
    return err(responseError(response.value));
  }
  const parsed = microLinkResponse.safeParse(body.value);
  if (!parsed.success) {
    return err(responseError(response.value));
  }
  const { data } = parsed;
  if (data.status === "success") {
    return ok(data.data);
  }
  const detail =
    Object.values(data.data ?? {}).join("; ") ||
    data.message ||
    data.code ||
    data.status;
  return err(new Error(detail));
}

function responseError(response: Response) {
  return response.ok
    ? new Error("Unexpected metadata response")
    : new Error(`${response.status}:${response.statusText}`);
}
