import "server-only";

import { db } from "@/infra/db";
import { Annotation } from "@/models/api";
import { annotation } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { eq, inArray, operators } from "drizzle-orm";
import type { Operators, SQL } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const AnnotationService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Annotation.create>,
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
    db.insert(annotation).values(values),
    wrapError,
  );
  return result.isOk() ? ok(ids) : err(result.error);
}

async function update(
  data: z.infer<typeof Annotation.update>,
): Promise<Result<null, Error>> {
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
  return result.isOk() ? ok(null) : err(result.error);
}

async function remove(
  ids: z.infer<typeof Annotation.delete>,
): Promise<Result<null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.delete(annotation).where(inArray(annotation.id, ids)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function get(
  where: z.infer<typeof Annotation.get>,
): Promise<Result<typeof annotation.$inferSelect | null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.query.annotation.findFirst({ where }),
    wrapError,
  );
  return result.isOk() ? ok(result.value ?? null) : err(result.error);
}

async function list(
  params: z.infer<typeof Annotation.list>,
): Promise<Result<ListResult<typeof annotation.$inferSelect>, Error>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.annotation.findMany({
        where: { RAW },
        orderBy: (fields) => buildOrder(sort, fields),
        ...pager(pagination),
      });
      const count = await tx.$count(annotation, RAW(annotation, operators));
      return { list, count };
    }),
    wrapError,
  );
  return result.isOk() ? ok(result.value) : err(result.error);
}

function buildWhere(filter: z.infer<typeof Annotation.list>["filter"]) {
  return (table: typeof annotation, { and, or, eq }: Operators) => {
    const conditions = new Array<SQL | undefined>();
    for (const param of filter ?? []) {
      const subConditions = new Array<SQL | undefined>();
      if (param.url) {
        subConditions.push(eq(table.url, param.url));
      }
      if (param.type) {
        subConditions.push(eq(table.type, param.type));
      }
      if (param.createAt) {
        subConditions.push(buildTimeFilter(param.createAt, table.createAt));
      }
      if (param.updateAt) {
        subConditions.push(buildTimeFilter(param.updateAt, table.updateAt));
      }
      if (subConditions.length > 0) {
        conditions.push(and(...subConditions));
      }
    }
    return or(...conditions)!;
  };
}
