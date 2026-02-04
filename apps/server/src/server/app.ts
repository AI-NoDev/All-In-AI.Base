import { dbActions, filesActions } from "@qiyu-allinai/actions";
import { base } from "./base";
import {
  corsPlugin,
  bearerPlugin,
  jwtPlugin,
  openapiPlugin,
  cronPlugin,
  serverTimingPlugin,
  loggerPlugin,
  llmsPlugin,
  oauth2Plugin,
  initAdminPlugin,
  actionsPlugin,
} from "./plugins";
import { authRouter, wsRouter } from "../routers";

/**
 * 完整的 Elysia 应用实例
 * 通过链式调用 use() 组合所有插件，保留完整类型推导
 */
export const app = base
  .use(corsPlugin)
  .use(loggerPlugin)
  .use(serverTimingPlugin)
  .use(bearerPlugin)
  .use(jwtPlugin)
  .use(openapiPlugin)
  .use(cronPlugin)
  .use(llmsPlugin)
  .use(oauth2Plugin)
  .use(initAdminPlugin)
  .use(authRouter)
  .use(wsRouter)
  .get("/", () => ({ message: "Hello AI Drive System" }))
  .get("/health", () => ({ status: "ok", timestamp: Date.now() }))
  .use(actionsPlugin([...dbActions, ...filesActions]));

export type App = typeof app;
