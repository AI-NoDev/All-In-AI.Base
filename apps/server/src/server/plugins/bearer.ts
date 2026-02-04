import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";

export const bearerPlugin = new Elysia({ name: "plugin/bearer" })
  .use(bearer());
