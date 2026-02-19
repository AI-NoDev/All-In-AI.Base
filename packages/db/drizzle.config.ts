import { defineConfig } from "drizzle-kit";

// Bun 自动加载 .env，但 drizzle-kit 可能需要显式加载
const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/allinai";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/entities/*/exportSchemas.ts",

  dbCredentials: {
    url: databaseUrl,
  },

});
