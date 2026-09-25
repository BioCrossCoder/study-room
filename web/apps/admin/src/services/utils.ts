import { pagination, time } from "@/models/api";
import {
  and,
  eq,
  gt,
  gte,
  lt,
  lte,
  ne,
  or,
  sql,
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

export function buildOrder<
  T extends {
    field: string;
    direction: "asc" | "desc";
  }[],
>(param: T) {
  const items = new Array<string>();
  for (const item of param) {
    const { field, direction } = item;
    items.push(`${field} ${direction}`);
  }
  return sql`${items.join(",")}`;
}
