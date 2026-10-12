import type { z } from "zod";
import { sort, time } from "./api";
import { annotationTypes } from "./enums";

export type Sort = z.infer<typeof sort>[number];

export type Resource =
  | "library"
  | "resource"
  | "bookmark"
  | "annotation"
  | "summary";

export type AnnotationType = (typeof annotationTypes)[number];

export type TimeFilter = z.infer<typeof time>;

export type TimestampFilter<T> = {
  [K in keyof T as NonNullable<T[K]> extends TimeFilter ? K : never]: T[K];
};

export type TimestampFields<T> = readonly {
  id: keyof TimestampFilter<T> & string;
  label: string;
}[];
