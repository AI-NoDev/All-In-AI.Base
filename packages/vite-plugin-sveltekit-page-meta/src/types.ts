export interface PageMeta {
  /** 页面路径 */
  path: string;
  /** 页面标题 */
  title?: string;
  /** 权限标识 */
  permission?: string;
  /** 图标 */
  icon?: string;
  /** 分组 */
  group?: string;
  /** 排序 */
  order?: number;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 面包屑 */
  breadcrumb?: string[];
  /** 自定义字段 */
  [key: string]: unknown;
}

export interface PluginOptions {
  /** 扫描的根目录，默认 src/routes */
  routesDir?: string;
  /** 输出文件路径，默认 src/lib/generated-pages.ts */
  output?: string;
  /** 忽略的目录/文件正则 */
  ignore?: (string | RegExp)[];
  /** 解析策略: ast | regex */
  parseStrategy?: 'ast' | 'regex';
  /** 动态路由格式: bracket ([id]) | colon (:id) | brace ({id}) */
  dynamicRouteFormat?: 'bracket' | 'colon' | 'brace';
  /** 是否生成类型定义 */
  generateTypes?: boolean;
  /** 是否监听文件变化 */
  watch?: boolean;
}

export interface ParsedPage {
  filePath: string;
  routePath: string;
  meta: Partial<PageMeta>;
}
