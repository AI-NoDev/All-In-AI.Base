import { cron } from "@elysiajs/cron";
import { Elysia } from "elysia";

export const cronPlugin = new Elysia({ name: "plugin/cron" })
  .use(cron({
    name: "heartbeat",
    pattern: "0 */5 * * * *", // 每5分钟
    run() {
      console.log("[cron] heartbeat:", new Date().toISOString());
    },
  }));
