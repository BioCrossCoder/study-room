import z from "zod";
import { annotationTypes } from "./enums";

const id = z.uuid();
const name = z.string().min(1).max(100);
const url = z.url();
const description = z.string().nonempty();

export const Library = {
  create: z.object({ id, name, url, description }),
  update: z.object({ id, name, description }),
  delete: z.object({ id }),
};

const xpath = z.string().nonempty();
const offset = z.number().int().nonnegative();
export const Bookmark = {
  create: z.object({ id, url, xpath, offset }),
  update: z.object({ id, xpath, offset }),
  delete: z.object({ id }),
};

const start = z.string().nonempty();
const end = z.string().nonempty();
const content = z.string().nonempty();
const annotationType = z.enum(annotationTypes);
export const Annotation = {
  create: z.object({
    id,
    url,
    start,
    startOffset: offset,
    end,
    endOffset: offset,
    content,
    type: annotationType,
  }),
  update: z.object({
    id,
    content,
    type: annotationType,
  }),
  delete: z.object({ id }),
};

export const Summary = {
  create: z.object({ id, url, content }),
  update: z.object({ id, content }),
  delete: z.object({ id }),
};

const nullableId = z.uuid().nullable();
export const Resource = {
  create: z.object({
    id,
    name,
    url,
    description,
    libraryId: nullableId,
    bookmarkId: nullableId,
  }),
  update: z.object({
    id,
    name,
    description,
    libraryId: nullableId,
    bookmarkId: nullableId,
  }),
  delete: z.object({ id }),
};
