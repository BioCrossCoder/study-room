import { db } from "@/infra/db";
import { Resource } from "@/models/api";
import { resource } from "@/models/orm";
import { wrapError } from "common";
import { ListResult } from "./utils";
import { and, eq, inArray, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const ResourceService = { create, update, remove, get, list };

async function create(
  data: z.infer<typeof Resource.create>,
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
    db.insert(resource).values(values),
    wrapError,
  );
  return result.isOk() ? ok(ids) : err(result.error);
}

async function update(
  data: z.infer<typeof Resource.update>,
): Promise<Result<null, Error>> {
  const { id, ...values } = data;
  const result = await ResultAsync.fromPromise(
    db
      .update(resource)
      .set({ ...values, updateAt: new Date() })
      .where(eq(resource.id, id)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function remove(
  ids: z.infer<typeof Resource.delete>,
): Promise<Result<null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.delete(resource).where(inArray(resource.id, ids)),
    wrapError,
  );
  return result.isOk() ? ok(null) : err(result.error);
}

async function get(
  where: z.infer<typeof Resource.get>,
): Promise<Result<typeof resource.$inferSelect | null, Error>> {
  const result = await ResultAsync.fromPromise(
    db.query.resource.findFirst({
      where,
      with: {
        library: true,
        bookmark: true,
      },
    }),
    wrapError,
  );
  return result.isOk() ? ok(result.value ?? null) : err(result.error);
}

async function list(
  params: z.infer<typeof Resource.list>,
): Promise<Result<ListResult<typeof resource.$inferSelect>, Error>> {
  const { filter, sort, pagination } = params;
  const RAW = buildWhere(filter);
  const result = await ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const list = await tx.query.resource.findMany({
        where: { RAW },
        orderBy: () => buildOrder(sort),
        ...pager(pagination),
      });
      const count = await tx.$count(resource, RAW);
      return { list, count };
    }),
    wrapError,
  );
  return result.isOk() ? ok(result.value) : err(result.error);
}

function buildWhere(filter: z.infer<typeof Resource.list>["filter"]) {
  const conditions = new Array<SQL | undefined>();
  for (const param of filter ?? []) {
    const subConditions = new Array<SQL | undefined>();
    if (param.name) {
      subConditions.push(like(resource.name, `%${param.name}%`));
    }
    if (param.libraryId) {
      subConditions.push(eq(resource.libraryId, param.libraryId));
    }
    if (param.createAt) {
      subConditions.push(buildTimeFilter(param.createAt, resource.createAt));
    }
    if (param.updateAt) {
      subConditions.push(buildTimeFilter(param.updateAt, resource.updateAt));
    }
    if (param.lastVisit) {
      subConditions.push(buildTimeFilter(param.lastVisit, resource.lastVisit));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}
