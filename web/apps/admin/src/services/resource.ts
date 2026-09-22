import { db } from "@/infra/db";
import { Resource } from "@/models/api";
import { resource } from "@/models/orm";
import { wrapError } from "common";
import { and, eq, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { buildOrder, buildTimeFilter, pager } from "./utils";

export const ResourceService = { add, replace, remove, get, list };

async function add(
  data: z.infer<typeof Resource.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(resource).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
  data: z.infer<typeof Resource.update>,
): Promise<Error | null> {
  const { id, ...values } = data;
  const result = await ResultAsync.fromPromise(
    db
      .update(resource)
      .set({ ...values, updateAt: new Date() })
      .where(eq(resource.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(resource).where(eq(resource.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function get(
  where: z.infer<typeof Resource.get>,
): Promise<Error | typeof resource.$inferSelect | null> {
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
  return result.isErr() ? result.error : (result.value ?? null);
}

async function list(
  params: z.infer<typeof Resource.list>,
): Promise<Error | (typeof resource.$inferSelect)[]> {
  const { filter, sort, pagination } = params;
  const result = await ResultAsync.fromPromise(
    db.query.resource.findMany({
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
