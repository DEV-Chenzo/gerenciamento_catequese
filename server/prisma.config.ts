import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/infrastructure/database/prisma/schema.prisma",
  migrations: {
    path: "src/infrastructure/database/prisma/migrations",
    seed: "src/infrastructure/database/lib/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
