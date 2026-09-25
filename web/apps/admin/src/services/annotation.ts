import { db } from "@/infra/db";
import { Annotation } from "@/models/api";
import { annotation } from "@/models/orm";
import { wrapError, ListResult } from "common";
import { and, eq, inArray, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const AnnotationService = {
  create,
  update,
  remove,
  get,
  list,
};

async function create(
  data: z.infer<typeof Annotation.create>,
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
    db.insert(annotation).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : id;
}

async function update(
  data: z.infer<typeof Annotation.update>,
): Promise<Error | null> {
  const { id, content, type } = data;
  const values = {
    content,
    type,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(annotation).set(values).where(eq(annotation.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(
  ids: z.infer<typeof Annotation.delete>,
): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(annotation).where(inArray(annotation.id, ids)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function get(
  where: z.infer<typeof Annotation.get>,
): Promise<Error | typeof annotation.$inferSelect | null> {
  const result = await ResultAsync.fromPromise(
    db.query.annotation.findFirst({ where }),
    wrapError,
  );
  return result.isErr() ? result.error : (result.value ?? null);
}

async function list(
  params: z.infer<typeof Annotation.list>,
): Promise<Error | ListResult<typeof annotation.$inferSelect>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.annotation.findMany({
        where: { RAW },
        orderBy: () => buildOrder(sort),
        ...pager(pagination),
      });
      const count = await tx.$count(annotation, RAW);
      return { list, count };
    }),
    wrapError,
  );
  return result.isErr() ? result.error : result.value;
}

function buildWhere(filter: z.infer<typeof Annotation.list>["filter"]) {
  const conditions = new Array<SQL | undefined>();
  for (const param of filter ?? []) {
    const subConditions = new Array<SQL | undefined>();
    if (param.url) {
      subConditions.push(eq(annotation.url, param.url));
    }
    if (param.type) {
      subConditions.push(eq(annotation.type, param.type));
    }
    if (param.createAt) {
      subConditions.push(buildTimeFilter(param.createAt, annotation.createAt));
    }
    if (param.updateAt) {
      subConditions.push(buildTimeFilter(param.updateAt, annotation.updateAt));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}
