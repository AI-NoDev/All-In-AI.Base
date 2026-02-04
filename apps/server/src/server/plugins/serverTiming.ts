import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";

export const serverTimingPlugin = new Elysia({ name: "plugin/server-timing" })
  .use(serverTiming());
