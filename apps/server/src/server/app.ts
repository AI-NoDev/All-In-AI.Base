import { dbActions, filesActions, devActions } from "@qiyu-allinai/actions";
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
  initSeedDataPlugin,
  initAdminPlugin,
  actionsPlugin,
  aiPlugin,
  i18nPlugin,
} from "./plugins";
import { authRouter, wsRouter } from "../routers";

// 核心 actions
const coreActions = [...dbActions, ...filesActions, ...devActions];

/**
 * 创建完整的 Elysia 应用实例
 */
function createApp() {
  return base
    .use(corsPlugin)
    .use(loggerPlugin)
    .use(serverTimingPlugin)
    .use(i18nPlugin)
    .use(bearerPlugin)
    .use(jwtPlugin)
    .use(openapiPlugin)
    .use(cronPlugin)
    .use(llmsPlugin)
    .use(oauth2Plugin)
    .use(initSeedDataPlugin)
    .use(initAdminPlugin)
    .use(aiPlugin)
    .use(authRouter)
    .use(wsRouter)
    .get("/", () => ({ message: "Hello AI Drive System" }))
    .get("/health", () => ({ status: "ok", timestamp: Date.now() }))
    .use(actionsPlugin(coreActions));
}

// 导出创建函数
export { createApp };
