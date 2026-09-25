import { db } from "@/infra/db";
import { Library } from "@/models/api";
import { library } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { and, eq, inArray, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const LibraryService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Library.create>,
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
    db.insert(library).values(values),
    wrapError,
  );
  return result.isOk() ? ok(ids) : err(result.error);
}

async function update(
  data: z.infer<typeof Library.update>,
): Promise<Result<null, Error>> {
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
  return result.isOk() ? ok(null) : err(result.error);
}

async function remove(
  ids: z.infer<typeof Library.delete>,
): Promise<Result<null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.delete(library).where(inArray(library.id, ids)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function get(
  where: z.infer<typeof Library.get>,
): Promise<Result<typeof library.$inferSelect | null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.query.library.findFirst({
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
  params: z.infer<typeof Library.list>,
): Promise<Result<ListResult<typeof library.$inferSelect>, Error>> {
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
  return result.isOk() ? ok(result.value) : err(result.error);
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
