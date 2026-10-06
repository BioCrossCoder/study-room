import type { z } from "zod";
import { sort } from "./api";

export type Sort = z.infer<typeof sort>[number];
