import {
  integer,
  PgColumn,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

const id = uuid("id").primaryKey();
const name = varchar({ length: 100 }).notNull().unique();
const url = text().notNull().unique();
const description = text().notNull();

function refId(col: PgColumn) {
  return uuid().references(() => col);
}

const enum TableName {
  Resource = "resource",
  Library = "library",
  Bookmark = "bookmark",
  Annotation = "annotation",
  Summary = "summary",
}

export const library = pgTable(TableName.Library, {
  id,
  name,
  url,
  description,
});

export const bookmark = pgTable(TableName.Bookmark, {
  id,
  url,
  xpath: text().notNull(),
  offset: integer().notNull(),
});

export const annotationTypeEnum = pgEnum("annotationType", [
  "replace",
  "append",
  "remove",
  "explain",
]);

export const annotation = pgTable(TableName.Annotation, {
  id,
  url,
  start: text().notNull(),
  startOffset: integer().notNull(),
  end: text().notNull(),
  endOffset: integer().notNull(),
  content: text().notNull(),
  type: annotationTypeEnum("type"),
});

export const summary = pgTable(TableName.Summary, {
  id,
  url,
  content: text().notNull(),
});

export const resource = pgTable(TableName.Resource, {
  id,
  name,
  url,
  description,
  libraryId: refId(library.id),
  bookmarkId: refId(bookmark.id),
});

export const relations = defineRelations(
  { library, bookmark, resource },
  (r) => ({
    resource: {
      library: r.one.library({
        from: r.resource.libraryId,
        to: r.library.id,
        optional: true,
      }),
      bookmark: r.one.bookmark({
        from: r.resource.bookmarkId,
        to: r.bookmark.id,
        optional: true,
      }),
    },
    library: {
      resources: r.many.resource({
        from: r.library.id,
        to: r.resource.libraryId,
      }),
    },
    bookmark: {
      resources: r.many.resource({
        from: r.bookmark.id,
        to: r.resource.bookmarkId,
      }),
    },
  }),
);
