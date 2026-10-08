import { Result } from "neverthrow";

const parseJSON = Result.fromThrowable(
  (raw: string | null) => JSON.parse(raw ?? "[]") as unknown,
);

export function parseFilterParam<T extends Record<string, unknown>>(
  raw: string | null,
): T {
  const parsed = parseJSON(raw).unwrapOr([]);
  const [filter] = Array.isArray(parsed) ? parsed : [];
  return (filter ?? {}) as T;
}
