import { Result } from "neverthrow";

export function safeParseJsonArray(
  raw: string | null | undefined,
): Record<string, unknown>[] {
  const parsed = Result.fromThrowable((raw) => JSON.parse(raw ?? "[]"))(
    raw,
  ).unwrapOr([]);
  return Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [];
}

export function readListQuery(params: {
  filter?: string;
  sort?: string;
  page?: string;
  size?: string;
}) {
  return {
    filter: safeParseJsonArray(params.filter),
    sort: safeParseJsonArray(params.sort),
    pagination: {
      page: Number.parseInt(params.page ?? "1", 10),
      size: Number.parseInt(params.size ?? "20", 10),
    },
  };
}
