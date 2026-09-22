import z from "zod";
import { annotationTypes } from "./enums";

const id = z.uuid();
const name = z.string().min(1).max(100);
const url = z.url();
const description = z.string().nonempty();

// multiple conditions combine as `or` in array, `and` in object
export const time = z.array(
  z.object({
    gt: z.date().optional(),
    lt: z.date().optional(),
    eq: z.date().optional(),
    ne: z.date().optional(),
    lte: z.date().optional(),
    gte: z.date().optional(),
  }),
);

// multiple fields combine with order in array
const field = z.enum(["createAt", "updateAt", "id"]);
const direction = z.enum(["asc", "desc"]);
const sort = z.array(
  z.object({
    field,
    direction,
  }),
);

export const pagination = z.object({
  page: z.int().positive(),
  size: z.int().positive(),
});

export const Library = {
  create: z.object({ name, url, description }),
  update: z.object({ id, name, description }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ name }), z.object({ url })]),
  list: z.object({
    filter: z.array(
      z.object({
        name: name.optional(),
        createAt: time.optional(),
        updateAt: time.optional(),
      }),
    ),
    sort,
    pagination,
  }),
};

const xpath = z.string().nonempty();
const offset = z.int().nonnegative();
export const Bookmark = {
  create: z.object({ url, xpath, offset }),
  update: z.object({ id, xpath, offset }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ url })]),
  list: z.object({
    filter: z.array(
      z.object({
        createAt: time.optional(),
        updateAt: time.optional(),
      }),
    ),
    sort,
    pagination,
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
    filter: z.array(
      z.object({
        url: url.optional(),
        type: annotationType.optional(),
        createAt: time.optional(),
        updateAt: time.optional(),
      }),
    ),
    sort,
    pagination,
  }),
};

export const Summary = {
  create: z.object({ url, content }),
  update: z.object({ id, content }),
  delete: z.object({ id }),
  get: z.union([z.object({ id }), z.object({ url })]),
  list: z.object({
    filter: z.array(
      z.object({
        createAt: time.optional(),
        updateAt: time.optional(),
      }),
    ),
    sort,
    pagination,
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
    filter: z.array(
      z.object({
        name: name.optional(),
        libraryId: id.optional(),
        createAt: time.optional(),
        updateAt: time.optional(),
        lastVisit: time.optional(),
      }),
    ),
    sort: z.array(
      z.object({
        field: field.or(z.literal("lastVisit")),
        direction,
      }),
    ),
    pagination,
  }),
};
