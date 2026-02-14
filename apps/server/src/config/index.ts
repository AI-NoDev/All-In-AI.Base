/**
 * 服务器配置
 * 从环境变量读取，提供默认值
 */

import { ActionDefinition } from '@qiyu-allinai/actions';
import type { Elysia } from 'elysia';

/**
 * 扩展应用包配置
 */
export interface ExtendAppPackageConfig {
  /** 包名，如 @qiyu-allinai/app-xxx */
  package: string;
  /** 是否启用，默认 true */
  enabled?: boolean;
}

export const config = {
  // 服务器配置
  port: parseInt(Bun.env.PORT || "3000"),
  
  // JWT 配置
  jwt: {
    secret: Bun.env.JWT_SECRET || "your-secret-key-change-in-production",
    // Access Token 过期时间 (分钟)
    accessTokenExpMinutes: parseInt(Bun.env.ACCESS_TOKEN_EXP_MINUTES || "15"),
    // Refresh Token 过期时间 (天)
    refreshTokenExpDays: parseInt(Bun.env.REFRESH_TOKEN_EXP_DAYS || "7"),
  },
  
  // 数据库配置
  database: {
    url: Bun.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/allinai",
  },

  /**
   * 扩展应用包配置
   * 配置后会自动加载包下的 /actions 和 /server 导出
   * 
   * @example
   * extendsPluginPackages: [
   *   { package: '@qiyu-allinai/app-crm' },
   *   { package: '@qiyu-allinai/app-erp', enabled: false },
   * ]
   */
  extendsPluginPackages: [
    { package: '@qiyu-allinai/app-server-monitor' },
  ] as ExtendAppPackageConfig[],
};

// 计算 JWT 过期时间字符串
export const jwtExpStrings = {
  accessToken: `${config.jwt.accessTokenExpMinutes}m`,
  refreshToken: `${config.jwt.refreshTokenExpDays}d`,
};

// 计算过期时间毫秒数
export const jwtExpMs = {
  accessToken: config.jwt.accessTokenExpMinutes * 60 * 1000,
  refreshToken: config.jwt.refreshTokenExpDays * 24 * 60 * 60 * 1000,
};

/**
 * 动态加载扩展包的 Actions
 * 
 * @returns 所有扩展包的 actions 数组
 */
export async function loadExtendedActions(): Promise<ActionDefinition[]> {
  const allActions: ActionDefinition[] = [];
  
  for (const pkg of config.extendsPluginPackages) {
    if (pkg.enabled === false) continue;
    
    try {
      // 动态导入包的 actions
      const actionsModule = await import(`${pkg.package}/actions`);
      
      // 查找导出的 actions 数组
      if (actionsModule.actions && Array.isArray(actionsModule.actions)) {
        allActions.push(...actionsModule.actions);
        console.log(`[extends-app] Loaded ${actionsModule.actions.length} actions from ${pkg.package}`);
      } else if (actionsModule.default && Array.isArray(actionsModule.default)) {
        allActions.push(...actionsModule.default);
        console.log(`[extends-app] Loaded ${actionsModule.default.length} actions from ${pkg.package}`);
      } else {
        // 尝试收集所有导出的 action
        const exportedActions = Object.values(actionsModule).filter(
          (v): v is object => typeof v === 'object' && v !== null && 'meta' in v && 'execute' in v
        );
        if (exportedActions.length > 0) {
          allActions.push(...exportedActions);
          console.log(`[extends-app] Loaded ${exportedActions.length} actions from ${pkg.package}`);
        }
      }
    } catch (error) {
      console.error(`[extends-app] Failed to load actions from ${pkg.package}:`, error);
    }
  }
  
  return allActions;
}

/**
 * 动态加载扩展包的 Elysia 插件
 * 
 * @returns 所有扩展包的 Elysia 插件数组
 */
export async function loadExtendedPlugins(): Promise<Elysia[]> {
  const plugins: Elysia[] = [];
  
  for (const pkg of config.extendsPluginPackages) {
    if (pkg.enabled === false) continue;
    
    try {
      // 动态导入包的 server 模块
      const serverModule = await import(`${pkg.package}/server`);

      // 查找导出的 Elysia 插件（以 Plugin 结尾的导出）
      for (const [key, value] of Object.entries(serverModule)) {
        if (key.endsWith('Plugin') && value && typeof value === 'object' && 'handle' in value) {
          plugins.push(value as Elysia);
          console.log(`[extends-app] Loaded plugin ${key} from ${pkg.package}`);
        }
      }
    } catch (error) {
      // server 模块可能不存在，这是正常的
      if ((error as NodeJS.ErrnoException).code !== 'ERR_MODULE_NOT_FOUND') {
        console.error(`[extends-app] Failed to load server from ${pkg.package}:`, error);
      }
    }
  }
  
  return plugins;
}

export default config;
