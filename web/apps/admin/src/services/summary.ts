import { db } from "@/infra/db";
import { Summary } from "@/models/api";
import { summary } from "@/models/orm";
import { wrapError } from "common";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";

export const SummaryService = { add, replace, remove, get };

async function add(
  data: z.infer<typeof Summary.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(summary).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
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

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(summary).where(eq(summary.id, id)),
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
