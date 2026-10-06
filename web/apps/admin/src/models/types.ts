import type { z } from "zod";
import { Library, sort } from "./api";

export type Sort = z.infer<typeof sort>[number];

export type LibraryFilter = z.infer<typeof Library.list>["filter"][number];
