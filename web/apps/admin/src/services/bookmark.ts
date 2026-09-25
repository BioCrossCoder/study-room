import { db } from "@/infra/db";
import { Bookmark } from "@/models/api";
import { bookmark } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { and, eq, inArray, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const BookmarkService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Bookmark.create>,
): Promise<Error | string[]> {
  const createAt = new Date();
  const ids = new Array<string>();
  const values = data.map((item) => {
    const id = uuidV7();
    ids.push(id);
    return {
      id,
      ...item,
      createAt,
      updateAt: createAt,
    };
  });
  const result = await ResultAsync.fromPromise(
    db.insert(bookmark).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : ids;
}

async function update(
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

async function remove(
  ids: z.infer<typeof Bookmark.delete>,
): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(bookmark).where(inArray(bookmark.id, ids)),
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
): Promise<Error | ListResult<typeof bookmark.$inferSelect>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.bookmark.findMany({
        where: { RAW },
        orderBy: () => buildOrder(sort),
        ...pager(pagination),
      });
      const count = await tx.$count(bookmark, RAW);
      return { list, count };
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
