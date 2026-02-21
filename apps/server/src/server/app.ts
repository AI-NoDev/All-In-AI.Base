import { dbActions, filesActions, devActions, wsActions } from "@qiyu-allinai/actions";
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
import { createMcpPlugin } from "./plugins/mcp";
import { wsPlugin, registerWsChannel, connectionManager } from "./plugins/ws";
import { imChannelHandler, monitorChannelHandler } from "./plugins/ws/channels";
import { authRouter } from "../routers";
import { monitorRouter, startScheduler } from "../monitor";

// 核心 actions（包含 WS actions）
const coreActions = [...dbActions, ...filesActions, ...devActions, ...wsActions];

/**
 * 创建完整的 Elysia 应用实例
 */
async function createApp() {
  // 启动监控调度器
  startScheduler();
  
  // 注册 WebSocket 频道处理器
  registerWsChannel(imChannelHandler);
  registerWsChannel(monitorChannelHandler);

  // 创建 MCP 插件（异步加载数据库中的 MCP 服务器配置）
  const mcpPlugin = await createMcpPlugin();
  
  return base
    .use(corsPlugin)
    .use(loggerPlugin)
    .use(serverTimingPlugin)
    .use(i18nPlugin)
    // MCP plugin 在 auth 之前注册（公开路由，使用 API Key 认证）
    // @ts-ignore - elysia version mismatch
    .use(mcpPlugin)
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
    .use(actionsPlugin(coreActions, connectionManager));
}

// 导出创建函数
export { createApp };
