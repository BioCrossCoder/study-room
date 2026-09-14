import { dbCredentials } from "@/config/db";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/models/orm.ts",
  dialect: "postgresql",
  dbCredentials,
});
