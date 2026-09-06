import { dbCredentials } from "@/config/db";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log(process.env.NODE_ENV)

export default defineConfig({
  out: "./migrations",
  schema: "./src/models/orm.ts",
  dialect: "postgresql",
  dbCredentials,
});
