import { resolve, relative, dirname, sep, posix } from 'node:path';
import fg from 'fast-glob';
import type { PluginOptions, ParsedPage } from './types';
import { parsePageMeta } from './parser';

/**
 * 将文件路径转换为路由路径
 */
function filePathToRoutePath(
  filePath: string,
  routesDir: string,
  dynamicFormat: PluginOptions['dynamicRouteFormat'] = 'bracket'
): string {
  // 获取相对路径
  let routePath = relative(routesDir, dirname(filePath));

  // 统一使用 posix 分隔符
  routePath = routePath.split(sep).join(posix.sep);

  // 处理根路径
  if (routePath === '' || routePath === '.') {
    return '/';
  }

  // 处理动态路由格式
  if (dynamicFormat === 'colon') {
    // [id] -> :id
    routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');
  } else if (dynamicFormat === 'brace') {
    // [id] -> {id}
    routePath = routePath.replace(/\[([^\]]+)\]/g, '{$1}');
  }
  // bracket 格式保持原样

  // 处理分组路由 (xxx) -> 移除
  routePath = routePath.replace(/\([^)]+\)\/?/g, '');

  // 确保以 / 开头
  return '/' + routePath;
}

/**
 * 检查路径是否应该被忽略
 */
function shouldIgnore(filePath: string, ignorePatterns: (string | RegExp)[]): boolean {
  return ignorePatterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return filePath.includes(pattern);
    }
    return pattern.test(filePath);
  });
}

/**
 * 扫描所有页面文件
 */
export async function scanPages(options: PluginOptions): Promise<ParsedPage[]> {
  const {
    routesDir = 'src/routes',
    ignore = [],
    parseStrategy = 'regex',
    dynamicRouteFormat = 'bracket',
  } = options;

  const absoluteRoutesDir = resolve(process.cwd(), routesDir);

  // 默认忽略模式
  const defaultIgnore = [
    /components/,
    /__tests__/,
    /\.test\./,
    /\.spec\./,
  ];

  const allIgnore = [...defaultIgnore, ...ignore];

  // 扫描 +page.ts 和 +page.js 文件
  const files = await fg(['**/+page.ts', '**/+page.js'], {
    cwd: absoluteRoutesDir,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  const pages: ParsedPage[] = [];

  for (const filePath of files) {
    // 检查是否应该忽略
    if (shouldIgnore(filePath, allIgnore)) {
      continue;
    }

    // 解析 meta
    const meta = await parsePageMeta(filePath, parseStrategy);

    // 计算路由路径
    const routePath = filePathToRoutePath(filePath, absoluteRoutesDir, dynamicRouteFormat);

    pages.push({
      filePath,
      routePath,
      meta: meta || {},
    });
  }

  // 按 order 和 path 排序
  pages.sort((a, b) => {
    const orderA = a.meta.order ?? 999;
    const orderB = b.meta.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.routePath.localeCompare(b.routePath);
  });

  return pages;
}
