import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "@/models/orm";
import { dbCredentials } from "@/config/db";

const client = new Pool(dbCredentials);

export const db = drizzle({ client, relations });
