/**
 * vite-plugin-sveltekit-extends-app
 * 
 * 用于扩展 SvelteKit 应用的 Vite 插件
 * 自动同步 monorepo 中扩展包的 routes 到主应用
 */

import { resolve } from 'node:path';
import type { PluginOptions, ExtendAppConfig } from './types';
import { syncAllPackages } from './syncer';

export type { PluginOptions, ExtendAppConfig, SyncManifest, SyncRecord } from './types';

const PLUGIN_NAME = 'vite-plugin-sveltekit-extends-app';

/**
 * SvelteKit 扩展应用 Vite 插件
 * 
 * @example
 * // vite.config.ts
 * import { extendsAppPlugin } from 'vite-plugin-sveltekit-extends-app';
 * 
 * export default defineConfig({
 *   plugins: [
 *     extendsAppPlugin({
 *       apps: [
 *         { package: '@qiyu-allinai/app-crm', basePath: '/dashboard/crm' },
 *         { package: '@qiyu-allinai/app-erp', basePath: '/dashboard/erp' },
 *       ],
 *     }),
 *   ],
 * });
 */
export function extendsAppPlugin(options: PluginOptions) {
  const {
    apps = [],
    routesDir = 'src/routes',
    watch = true,
    logLevel = 'info',
  } = options;

  const resolvedRoutesDir = resolve(process.cwd(), routesDir);

  // 执行同步
  function sync() {
    const enabledApps = apps.filter((app) => app.enabled !== false);
    if (enabledApps.length === 0) {
      if (logLevel === 'debug') {
        console.log(`[${PLUGIN_NAME}] No enabled apps to sync`);
      }
      return;
    }

    syncAllPackages(enabledApps, resolvedRoutesDir, logLevel);
  }

  return {
    name: PLUGIN_NAME,

    // 构建开始时同步
    async buildStart() {
      sync();
    },

    // 开发服务器配置
    configureServer(server: {
      watcher: {
        on: (event: string, handler: (file: string) => void) => void;
      };
    }) {
      if (!watch) return;

      // 监听扩展包的 routes 变化
      const watcher = server.watcher;

      const handleChange = (file: string) => {
        // 检查是否是扩展包的 routes 文件
        const isExtendedRoute = apps.some((app) => {
          const packageName = app.package.split('/').pop() || '';
          return file.includes(packageName) && file.includes('client/routes');
        });

        if (isExtendedRoute) {
          console.log(`[${PLUGIN_NAME}] Detected change, re-syncing...`);
          sync();
        }
      };

      watcher.on('add', handleChange);
      watcher.on('change', handleChange);
      watcher.on('unlink', handleChange);
    },
  };
}

// 默认导出
export default extendsAppPlugin;

// 便捷函数：创建扩展应用配置
export function defineExtendApp(
  packageName: string,
  basePath: string,
  enabled = true
): ExtendAppConfig {
  return {
    package: packageName,
    basePath,
    enabled,
  };
}
