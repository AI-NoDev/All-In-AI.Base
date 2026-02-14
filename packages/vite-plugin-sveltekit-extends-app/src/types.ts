/**
 * 扩展应用包配置
 */
export interface ExtendAppConfig {
  /** 包名，如 @qiyu-allinai/app-xxx */
  package: string;
  /** 路由基础路径（已废弃，现在从 package.json 的目录结构自动推断） */
  basePath?: string;
  /** 是否启用，默认 true */
  enabled?: boolean;
}

/**
 * 插件选项
 */
export interface PluginOptions {
  /** 扩展应用配置列表 */
  apps: ExtendAppConfig[];
  /** 前端 routes 目录，默认 src/routes */
  routesDir?: string;
  /** 是否监听源文件变化自动同步，默认 true */
  watch?: boolean;
  /** 是否在构建时清理已删除的源文件，默认 false */
  cleanOnBuild?: boolean;
  /** 日志级别 */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * 文件同步记录
 */
export interface SyncRecord {
  /** 源文件路径 */
  source: string;
  /** 目标文件路径 */
  target: string;
  /** 包名 */
  package: string;
  /** 同步时间 */
  syncedAt: string;
}

/**
 * 同步清单文件结构
 */
export interface SyncManifest {
  /** 版本 */
  version: string;
  /** 最后更新时间 */
  updatedAt: string;
  /** 同步记录 */
  records: SyncRecord[];
}

/**
 * 扩展应用包结构
 * 
 * @example
 * packages/app-xxx/
 * ├── server/
 * │   ├── db/           # 数据库实体
 * │   ├── actions/      # Actions 定义
 * │   ├── schemas/      # Zod Schemas
 * │   └── index.ts      # Elysia 插件导出
 * ├── client/
 * │   ├── routes/       # SvelteKit 路由
 * │   └── $lib/         # 共享组件/工具
 * └── package.json
 */
export interface ExtendAppStructure {
  server: {
    db: string;
    actions: string;
    schemas: string;
    index: string;
  };
  client: {
    routes: string;
    lib: string;
  };
}
