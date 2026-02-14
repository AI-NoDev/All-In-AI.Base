import { dbActions, filesActions, devActions } from "@qiyu-allinai/actions";
import { config, loadExtendedActions, loadExtendedPlugins } from "../config";
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
 * 支持动态加载扩展包的 actions 和 plugins
 */
async function createApp() {
  // 加载扩展包的 actions 和 plugins
  const extendedActions = await loadExtendedActions();
  const extendedPlugins = await loadExtendedPlugins();
  const allActions = [...coreActions, ...extendedActions];

  let app = base
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
    .use(wsRouter);
  
  // 动态加载扩展插件
  for (const plugin of extendedPlugins) {
    app = app.use(plugin);
  }
  
  return app
    .get("/", () => ({ message: "Hello AI Drive System" }))
    .get("/health", () => ({ status: "ok", timestamp: Date.now() }))
    .use(actionsPlugin(allActions));
}

// 导出创建函数供需要动态加载的场景使用
export { createApp };
