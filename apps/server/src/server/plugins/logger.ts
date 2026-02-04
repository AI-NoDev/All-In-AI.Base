import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";

export const loggerPlugin = new Elysia({ name: "plugin/logger" })
  .use(logger({
    level: Bun.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }));
