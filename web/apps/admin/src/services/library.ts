import { db } from "@/infra/db";
import { Library } from "@/models/api";
import { library } from "@/models/orm";
import { wrapError } from "common";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";

export const LibraryService = { add, replace, remove };

async function add(
  data: z.infer<typeof Library.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(library).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
  data: z.infer<typeof Library.update>,
): Promise<Error | null> {
  const { id, name, description } = data;
  const values = {
    name,
    description,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(library).set(values).where(eq(library.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(library).where(eq(library.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}
