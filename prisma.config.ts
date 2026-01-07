import "dotenv/config"  // ✅ Auto-included by prisma init --db
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // ✅ NO engine property - removed in Prisma 7
  datasource: {
    url: env("DATABASE_URL"),
  },
})
