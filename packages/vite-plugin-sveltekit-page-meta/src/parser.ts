import { readFileSync } from 'node:fs';
import type { PageMeta, PluginOptions } from './types';

/**
 * 使用正则解析 meta 对象
 */
function parseWithRegex(content: string): Partial<PageMeta> | null {
  // 匹配 export const _meta = { ... } (带下划线前缀)
  const metaMatch = content.match(
    /export\s+const\s+_meta\s*=\s*(\{[\s\S]*?\})\s*(?:;|$)/
  );

  if (!metaMatch) return null;

  const metaStr = metaMatch[1];

  try {
    // 安全解析：只允许基本类型
    const sanitized = metaStr
      // 移除注释
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // 处理单引号
      .replace(/'/g, '"')
      // 处理无引号的 key
      .replace(/(\w+)\s*:/g, '"$1":')
      // 处理尾随逗号
      .replace(/,\s*([\]}])/g, '$1');

    return JSON.parse(sanitized);
  } catch {
    // 回退到逐字段解析
    return parseFieldByField(metaStr);
  }
}

/**
 * 逐字段解析
 */
function parseFieldByField(metaStr: string): Partial<PageMeta> {
  const result: Partial<PageMeta> = {};

  // 解析字符串字段
  const stringFields = ['title', 'permission', 'icon', 'group'];
  for (const field of stringFields) {
    const match = metaStr.match(new RegExp(`${field}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`));
    if (match) {
      (result as Record<string, unknown>)[field] = match[1];
    }
  }

  // 解析数字字段
  const orderMatch = metaStr.match(/order\s*:\s*(\d+)/);
  if (orderMatch) {
    result.order = parseInt(orderMatch[1], 10);
  }

  // 解析布尔字段
  const hiddenMatch = metaStr.match(/hidden\s*:\s*(true|false)/);
  if (hiddenMatch) {
    result.hidden = hiddenMatch[1] === 'true';
  }

  // 解析数组字段 (breadcrumb)
  const breadcrumbMatch = metaStr.match(/breadcrumb\s*:\s*\[([\s\S]*?)\]/);
  if (breadcrumbMatch) {
    const items = breadcrumbMatch[1].match(/['"`]([^'"`]+)['"`]/g);
    if (items) {
      result.breadcrumb = items.map((s) => s.replace(/['"`]/g, ''));
    }
  }

  return result;
}

/**
 * 使用 AST 解析 (通过 esbuild transform)
 */
async function parseWithAST(content: string): Promise<Partial<PageMeta> | null> {
  try {
    // 动态导入 esbuild
    const { transform } = await import('esbuild');

    // 转换 TS 到 JS
    const result = await transform(content, {
      loader: 'ts',
      format: 'esm',
    });

    // 从转换后的代码中提取 meta
    return parseWithRegex(result.code);
  } catch {
    // 回退到正则解析
    return parseWithRegex(content);
  }
}

/**
 * 解析页面文件中的 meta
 */
export async function parsePageMeta(
  filePath: string,
  strategy: PluginOptions['parseStrategy'] = 'regex'
): Promise<Partial<PageMeta> | null> {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // 快速检查是否包含 _meta 导出
    if (!content.includes('export') || !content.includes('_meta')) {
      return null;
    }

    if (strategy === 'ast') {
      return await parseWithAST(content);
    }

    return parseWithRegex(content);
  } catch (error) {
    console.warn(`[vite-plugin-sveltekit-page-meta] Failed to parse ${filePath}:`, error);
    return null;
  }
}
