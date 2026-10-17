export const DEFAULT_SORT = {
  field: "createAt",
  direction: "desc",
} as const;

const DEFAULT_SORT_PARAM = JSON.stringify([
  DEFAULT_SORT,
  { field: "id", direction: "desc" },
]);

export const DEFAULT_PAGE = "1";
export const DEFAULT_PAGE_SIZE = "20";

export function applyListDefaults<T extends Record<string, string>>(
  params: T,
  query: URLSearchParams,
) {
  let redirect = false;
  if (!params.sort) {
    query.set("sort", DEFAULT_SORT_PARAM);
    redirect = true;
  }
  if (!params.page) {
    query.set("page", DEFAULT_PAGE);
    redirect = true;
  }
  if (!params.size) {
    query.set("size", DEFAULT_PAGE_SIZE);
    redirect = true;
  }
  return redirect;
}
