import z from "zod";
import { annotationTypes } from "./enums";

const id = z.uuid();
const name = z.string().min(1).max(100);
const url = z.url();
const description = z.string().nonempty();
const time = z.object({
  gt: z.date().optional(),
  lt: z.date().optional(),
  eq: z.date().optional(),
  ne: z.date().optional(),
});
const sort = z.array(
  z.object({
    field: z.enum(["createAt", "updateAt", "id"]),
    direction: z.enum(["asc", "desc"]),
  }),
);

export const Library = {
  create: z.object({ name, url, description }),
  update: z.object({ id, name, description }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ name }), z.object({ url })]),
  list: z.object({
    filter: z.object({
      name: name.optional(),
      createAt: time.optional(),
      updateAt: time.optional(),
    }),
    sort,
  }),
};

const xpath = z.string().nonempty();
const offset = z.number().int().nonnegative();
export const Bookmark = {
  create: z.object({ url, xpath, offset }),
  update: z.object({ id, xpath, offset }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ url })]),
  list: z.object({
    filter: z.object({
      createAt: time.optional(),
      updateAt: time.optional(),
    }),
    sort,
  }),
};

const start = z.string().nonempty();
const end = z.string().nonempty();
const content = z.string().nonempty();
const annotationType = z.enum(annotationTypes);
export const Annotation = {
  create: z.object({
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
  get: z.object({ id }),
  list: z.object({
    filter: z.object({
      url: url.optional(),
      type: annotationType.optional(),
      createAt: time.optional(),
      updateAt: time.optional(),
    }),
    sort,
  }),
};

export const Summary = {
  create: z.object({ url, content }),
  update: z.object({ id, content }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ url })]),
  list: z.object({
    filter: z.object({
      createAt: time.optional(),
      updateAt: time.optional(),
    }),
    sort,
  }),
};

const nullableId = z.uuid().nullable();
export const Resource = {
  create: z.object({
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
  get: z.union([z.object({ id }), z.object({ name }), z.object({ url })]),
  list: z.object({
    filter: z.object({
      name: name.optional(),
      libraryId: id.optional(),
      createAt: time.optional(),
      updateAt: time.optional(),
      lastVisit: time.optional(),
    }),
    sort: z.array(
      z.object({
        field: z.enum(["createAt", "updateAt", "id", "lastVisit"]),
        direction: z.enum(["asc", "desc"]),
      }),
    ),
  }),
};
