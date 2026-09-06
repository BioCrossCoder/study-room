import {
  integer,
  PgColumn,
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

const enum TableName {}

export const relations = defineRelations({}, (r) => ({}));
