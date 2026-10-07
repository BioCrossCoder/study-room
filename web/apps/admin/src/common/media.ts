export const COMPACT_MEDIA = "(width < 48rem)";

const queries = new Map<string, MediaQueryList>();

export function getMediaQuery(query: string) {
  let media = queries.get(query);
  if (!media) {
    media = window.matchMedia(query);
    queries.set(query, media);
  }
  return media;
}
