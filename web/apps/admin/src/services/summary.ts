import { db } from "@/infra/db";
import { Summary } from "@/models/api";
import { summary } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { and, eq, inArray, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const SummaryService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Summary.create>,
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
    db.insert(summary).values(values),
    wrapError,
  );
  return result.isOk() ? ok(ids) : err(result.error);
}

async function update(
  data: z.infer<typeof Summary.update>,
): Promise<Result<null, Error>> {
  const { id, content } = data;
  const values = {
    content,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(summary).set(values).where(eq(summary.id, id)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function remove(
  ids: z.infer<typeof Summary.delete>,
): Promise<Result<null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.delete(summary).where(inArray(summary.id, ids)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function get(
  where: z.infer<typeof Summary.get>,
): Promise<Result<typeof summary.$inferSelect | null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.query.summary.findFirst({ where }),
    wrapError,
  );
  return result.isOk() ? ok(result.value ?? null) : err(result.error);
}

async function list(
  params: z.infer<typeof Summary.list>,
): Promise<Result<ListResult<typeof summary.$inferSelect>, Error>> {
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
  return result.isOk() ? ok(result.value) : err(result.error);
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
