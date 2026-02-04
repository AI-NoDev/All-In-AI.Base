import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

export const openapiPlugin = new Elysia({ name: "plugin/openapi" })
  .use(openapi({
    documentation: {
      info: {
        title: "AI Drive System API",
        version: "1.0.0",
        description: "AI Drive System API Documentation",
      },
    },
  }));
