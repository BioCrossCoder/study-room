import { db } from "@/infra/db";
import { Bookmark } from "@/models/api";
import { bookmark } from "@/models/orm";
import { wrapError } from "common";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import "server-only";
import { v7 as uuidV7 } from "uuid";
import z from "zod";

export const BookmarkService = { add, replace, remove };

async function add(
  data: z.infer<typeof Bookmark.create>,
): Promise<Error | null> {
  const createAt = new Date();
  const values = {
    id: uuidV7(),
    ...data,
    createAt,
    updateAt: createAt,
  };
  const result = await ResultAsync.fromPromise(
    db.insert(bookmark).values(values),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function replace(
  data: z.infer<typeof Bookmark.update>,
): Promise<Error | null> {
  const { id, xpath, offset } = data;
  const values = {
    xpath,
    offset,
    updateAt: new Date(),
  };
  const result = await ResultAsync.fromPromise(
    db.update(bookmark).set(values).where(eq(bookmark.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}

async function remove(id: string): Promise<Error | null> {
  const result = await ResultAsync.fromPromise(
    db.delete(bookmark).where(eq(bookmark.id, id)),
    wrapError,
  );
  return result.isErr() ? result.error : null;
}
