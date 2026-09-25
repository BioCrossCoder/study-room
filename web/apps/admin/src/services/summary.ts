import { db } from "@/infra/db";
import { Summary } from "@/models/api";
import { summary } from "@/models/orm";
import { wrapError, ListResult } from "common";
import { and, eq, inArray, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const SummaryService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Summary.create>,
): Promise<Error | string> {
  const createAt = new Date();
  const id = uuidV7();
  const values = data.map((item) => ({
    id,
    ...item,
    createAt,
    updateAt: createAt,
  }));
  const result = await ResultAsync.fromPromise(
    db.insert(summary).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : id;
}

async function update(
  data: z.infer<typeof Summary.update>,
): Promise<Error | null> {
  const { id, content } = data;
  const values = {
    content,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(summary).set(values).where(eq(summary.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(
  ids: z.infer<typeof Summary.delete>,
): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(summary).where(inArray(summary.id, ids)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function get(
  where: z.infer<typeof Summary.get>,
): Promise<Error | typeof summary.$inferSelect | null> {
  const result = await ResultAsync.fromPromise(
    db.query.summary.findFirst({ where }),
    wrapError,
  );
  return result.isErr() ? result.error : (result.value ?? null);
}

async function list(
  params: z.infer<typeof Summary.list>,
): Promise<Error | ListResult<typeof summary.$inferSelect>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.summary.findMany({
        where: { RAW },
        orderBy: () => buildOrder(sort),
        ...pager(pagination),
      });
      const count = await tx.$count(summary, RAW);
      return { list, count };
    }),
    wrapError,
  );
  return result.isErr() ? result.error : result.value;
}

function buildWhere(filter: z.infer<typeof Summary.list>["filter"]) {
  const conditions = new Array<SQL | undefined>();
  for (const param of filter ?? []) {
    const subConditions = new Array<SQL | undefined>();
    if (param.createAt) {
      subConditions.push(buildTimeFilter(param.createAt, summary.createAt));
    }
    if (param.updateAt) {
      subConditions.push(buildTimeFilter(param.updateAt, summary.updateAt));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}
