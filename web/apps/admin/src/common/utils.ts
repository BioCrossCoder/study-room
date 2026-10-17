import { toast } from "@heroui/react";
import { wrapError } from "common";
import { redirect } from "next/navigation";
import { ResultAsync } from "neverthrow";

export function safeWrap<A extends unknown[], R>(
  f: (...args: A) => Promise<R>,
  message: string,
) {
  return async (...args: A) => {
    const result = await ResultAsync.fromPromise(f(...args), wrapError);
    if (result.isErr()) {
      toast.danger(message, { description: result.error.message });
      return null;
    }
    return result.value;
  };
}

export function autoRedirectOnDemand<T extends Record<string, string>>(
  path: string,
  params: T,
  beforeRedirect: (params: T, query: URLSearchParams) => boolean,
) {
  const query = new URLSearchParams(params);
  const ok = beforeRedirect(params, query);
  if (ok) {
    redirect(`${path}?${query.toString()}`);
  }
}
