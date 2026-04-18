import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    migrations: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? `file:${path.resolve("prisma/dev.db")}`,
  },
});
