import { db } from "@/infra/db";
import { Bookmark } from "@/models/api";
import { bookmark } from "@/models/orm";
import { wrapError } from "common";
import { and, eq, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const BookmarkService = { add, replace, remove, get, list };

async function add(
  data: z.infer<typeof Bookmark.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(bookmark).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
  data: z.infer<typeof Bookmark.update>,
): Promise<Error | null> {
  const { id, xpath, offset } = data;
  const values = {
    xpath,
    offset,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(bookmark).set(values).where(eq(bookmark.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(bookmark).where(eq(bookmark.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function get(
  where: z.infer<typeof Bookmark.get>,
): Promise<Error | typeof bookmark.$inferSelect | null> {
  const result = await ResultAsync.fromPromise(
    db.query.bookmark.findFirst({
      where,
      with: {
        resources: true,
      },
    }),
    wrapError,
  );
  return result.isErr() ? result.error : (result.value ?? null);
}

async function list(
  params: z.infer<typeof Bookmark.list>,
): Promise<Error | (typeof bookmark.$inferSelect)[]> {
  const { filter, sort, pagination } = params;
  const result = await ResultAsync.fromPromise(
    db.query.bookmark.findMany({
      where: {
        RAW: buildWhere(filter),
      },
      orderBy: () => buildOrder(sort),
      ...pager(pagination),
    }),
    wrapError,
  );
  return result.isErr() ? result.error : result.value;
}

function buildWhere(filter: z.infer<typeof Bookmark.list>["filter"]) {
  const conditions = new Array<SQL | undefined>();
  for (const param of filter ?? []) {
    const subConditions = new Array<SQL | undefined>();
    if (param.createAt) {
      subConditions.push(buildTimeFilter(param.createAt, bookmark.createAt));
    }
    if (param.updateAt) {
      subConditions.push(buildTimeFilter(param.updateAt, bookmark.updateAt));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}
