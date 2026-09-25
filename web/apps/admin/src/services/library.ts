import { db } from "@/infra/db";
import { Library } from "@/models/api";
import { library } from "@/models/orm";
import { wrapError, ListResult } from "common";
import { and, eq, inArray, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const LibraryService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Library.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = data.map((item) => ({
    id: uuidV7(),
    ...item,
    createAt,
    updateAt: createAt,
  }));
  const result = await ResultAsync.fromPromise(
    db.insert(library).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function update(
  data: z.infer<typeof Library.update>,
): Promise<Error | null> {
  const { id, name, description } = data;
  const values = {
    name,
    description,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(library).set(values).where(eq(library.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(
  ids: z.infer<typeof Library.delete>,
): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(library).where(inArray(library.id, ids)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function get(
  where: z.infer<typeof Library.get>,
): Promise<Error | typeof library.$inferSelect | null> {
  const result = await ResultAsync.fromPromise(
    db.query.library.findFirst({
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
  params: z.infer<typeof Library.list>,
): Promise<Error | ListResult<typeof library.$inferSelect>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.library.findMany({
        where: { RAW },
        orderBy: () => buildOrder(sort),
        ...pager(pagination),
      });
      const count = await tx.$count(library, RAW);
      return { list, count };
    }),
    wrapError,
  );
  return result.isErr() ? result.error : result.value;
}

function buildWhere(filter: z.infer<typeof Library.list>["filter"]) {
  const conditions = new Array<SQL | undefined>();
  for (const param of filter ?? []) {
    const subConditions = new Array<SQL | undefined>();
    if (param.name) {
      subConditions.push(like(library.name, `%${param.name}%`));
    }
    if (param.createAt) {
      subConditions.push(buildTimeFilter(param.createAt, library.createAt));
    }
    if (param.updateAt) {
      subConditions.push(buildTimeFilter(param.updateAt, library.updateAt));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}
