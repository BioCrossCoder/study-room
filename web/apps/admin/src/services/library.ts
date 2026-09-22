import { db } from "@/infra/db";
import { Library } from "@/models/api";
import { library } from "@/models/orm";
import { wrapError } from "common";
import { and, eq, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const LibraryService = { add, replace, remove, get, list };

async function add(
  data: z.infer<typeof Library.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(library).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
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

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(library).where(eq(library.id, id)),
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
): Promise<Error | (typeof library.$inferSelect)[]> {
  const { filter, sort, pagination } = params;
  const result = await ResultAsync.fromPromise(
    db.query.library.findMany({
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
