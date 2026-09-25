import { db } from "@/infra/db";
import { Bookmark } from "@/models/api";
import { bookmark } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { and, eq, inArray, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const BookmarkService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Bookmark.create>,
): Promise<Result<string[], Error>> {
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
  return result.isOk() ? ok(ids) : err(result.error);
}

async function update(
  data: z.infer<typeof Bookmark.update>,
): Promise<Result<null, Error>> {
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
  return result.isOk() ? ok(null) : err(result.error);
}

async function remove(
  ids: z.infer<typeof Bookmark.delete>,
): Promise<Result<null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.delete(bookmark).where(inArray(bookmark.id, ids)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function get(
  where: z.infer<typeof Bookmark.get>,
): Promise<Result<typeof bookmark.$inferSelect | null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.query.bookmark.findFirst({
      where,
      with: {
        resources: true,
      },
    }),
    wrapError,
  );
  return result.isOk() ? ok(result.value ?? null) : err(result.error);
}

async function list(
  params: z.infer<typeof Bookmark.list>,
): Promise<Result<ListResult<typeof bookmark.$inferSelect>, Error>> {
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
  return result.isOk() ? ok(result.value) : err(result.error);
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
