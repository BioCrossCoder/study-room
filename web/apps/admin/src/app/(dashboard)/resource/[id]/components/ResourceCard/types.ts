import type { bookmark, library, resource } from "@/models/orm";

export type ResourceDetail = typeof resource.$inferSelect & {
  library: typeof library.$inferSelect | null;
  bookmark: typeof bookmark.$inferSelect | null;
};
