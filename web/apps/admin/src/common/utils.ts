import { redirect } from "next/navigation";

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
