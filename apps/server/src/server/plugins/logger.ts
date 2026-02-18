import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";

const isDev = process.env.NODE_ENV !== "production";

export const loggerPlugin = logger({
  autoLogging: true,
  level: Bun.env.LOG_LEVEL || "info",
  ...(isDev && {
    stream: pretty({
      colorize: true,
    }),
  }),
});
