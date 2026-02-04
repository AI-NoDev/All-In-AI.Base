import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/entities/*/exportSchemas.ts",

  dbCredentials: {
    url: "postgres://postgres:postgres@localhost:5432/allinai",
  },

});
