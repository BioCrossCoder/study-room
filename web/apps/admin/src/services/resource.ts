import { db } from "@/infra/db";
import { Resource } from "@/models/api";
import { resource } from "@/models/orm";
import { wrapError } from "common";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";

export const ResourceService = { add, replace, remove };

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
