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
import { wsPlugin, registerWsChannel } from "./plugins/ws";
import { imChannelHandler, monitorChannelHandler } from "./plugins/ws/channels";
import { authRouter } from "../routers";
import { monitorRouter, startScheduler } from "../monitor";

// 核心 actions
const coreActions = [...dbActions, ...filesActions, ...devActions];

/**
 * 创建完整的 Elysia 应用实例
 */
function createApp() {
  // 启动监控调度器
  startScheduler();
  
  // 注册 WebSocket 频道处理器
  registerWsChannel(imChannelHandler);
  registerWsChannel(monitorChannelHandler);
  
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
    .use(wsPlugin)
    .use(monitorRouter)
    .get("/", () => ({ message: "Hello AI Drive System" }))
    .get("/health", () => ({ status: "ok", timestamp: Date.now() }))
    .use(actionsPlugin(coreActions));
}

// 导出创建函数
export { createApp };
