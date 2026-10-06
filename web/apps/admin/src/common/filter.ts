type ListFilter = Record<string, unknown>;

export function parseFilter<T extends ListFilter>(raw: string | null): T {
  const [filter] = JSON.parse(raw ?? "[]") as T[];
  return filter ?? ({} as T);
}

export function patchFilter<T extends ListFilter>(
  query: URLSearchParams,
  patch: Partial<T>,
) {
  const filter: T = { ...parseFilter<T>(query.get("filter")) };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    if (value !== undefined) {
      filter[key] = value as T[keyof T];
    } else {
      delete filter[key];
    }
  }
  query.set(
    "filter",
    JSON.stringify(Object.keys(filter).length ? [filter] : []),
  );
}
