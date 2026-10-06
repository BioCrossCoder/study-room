import { pagination, time } from "@/models/api";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  lt,
  lte,
  ne,
  or,
  SQL,
  SQLWrapper,
} from "drizzle-orm";
import { z } from "zod";

export function buildTimeFilter(
  params: z.infer<typeof time>,
  field: SQLWrapper,
) {
  const conditions = new Array<SQL | undefined>();
  for (const item of params) {
    const subConditions = new Array<SQL>();
    if (item.gt) {
      subConditions.push(gt(field, item.gt));
    }
    if (item.lt) {
      subConditions.push(lt(field, item.lt));
    }
    if (item.eq) {
      subConditions.push(eq(field, item.eq));
    }
    if (item.ne) {
      subConditions.push(ne(field, item.ne));
    }
    if (item.lte) {
      subConditions.push(lte(field, item.lte));
    }
    if (item.gte) {
      subConditions.push(gte(field, item.gte));
    }
    if (subConditions.length > 0) {
      conditions.push(and(...subConditions));
    }
  }
  return or(...conditions);
}

export function pager(param: z.infer<typeof pagination>) {
  const { page, size } = param;
  return {
    offset: (page - 1) * size,
    limit: size,
  };
}

export type ListResult<T> = {
  list: T[];
  count: number;
};

export function buildOrder(
  param: readonly {
    field: string;
    direction: "asc" | "desc";
  }[],
  fields: unknown,
) {
  const items = new Array<SQL>();
  const columns = fields as Record<string, SQLWrapper>;
  for (const { field, direction } of param) {
    const column = columns[field];
    if (!column) {
      continue;
    }
    switch (direction) {
      case "asc":
        items.push(asc(column));
        break;
      case "desc":
        items.push(desc(column));
    }
  }
  return items;
}
