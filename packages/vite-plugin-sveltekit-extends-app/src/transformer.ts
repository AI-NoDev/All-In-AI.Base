/**
 * 文件内容转换器
 * 负责转换导入路径
 */

/**
 * 主应用的核心模块，这些不应该被转换
 * 扩展包应该使用主应用的这些模块
 */
const MAIN_APP_MODULES = [
  '@/lib/stores/',
  '$lib/api/',
  '$lib/hooks/',
  '$lib/components/ui/utils',
  '$lib/index',
];

/**
 * 检查路径是否是主应用的核心模块
 */
function isMainAppModule(importPath: string): boolean {
  return MAIN_APP_MODULES.some(mod => importPath.startsWith(mod));
}

/**
 * 转换文件中的导入路径
 * 
 * @param content 文件内容
 * @param packageName 包名，如 @qiyu-allinai/app-xxx
 * @returns 转换后的内容
 * 
 * @example
 * 转换前: import { Button } from '$lib/components/my-button';
 * 转换后: import { Button } from '@qiyu-allinai/app-xxx/client/$lib/components/my-button';
 * 
 * 保持不变: import { authStore } from '@/lib/stores/auth.svelte';
 * （主应用的 stores 不转换）
 */
export function transformImports(content: string, packageName: string, sourceRelativePath: string): string {
  let result = content;

  // 1. 转换 $lib 导入（排除主应用核心模块）
  // import xxx from '$lib/xxx' -> import xxx from '@package/client/$lib/xxx'
  result = result.replace(
    /from\s+['"](\$lib\/[^'"]+)['"]/g,
    (match, importPath) => {
      if (isMainAppModule(importPath)) {
        return match; // 保持不变
      }
      return `from '${packageName}/client/${importPath}'`;
    }
  );

  // 2. 转换 $lib 动态导入（排除主应用核心模块）
  // import('$lib/xxx') -> import('@package/client/$lib/xxx')
  result = result.replace(
    /import\s*\(\s*['"](\$lib\/[^'"]+)['"]\s*\)/g,
    (match, importPath) => {
      if (isMainAppModule(importPath)) {
        return match; // 保持不变
      }
      return `import('${packageName}/client/${importPath}')`;
    }
  );

  // 3. 转换相对路径导入（仅针对 $lib 下的文件）
  // 注意：routes 下的相对导入通常是同目录组件，不需要转换
  // 但如果是引用 $lib 的相对路径，需要转换
  
  // 4. 转换 @/ 别名（如果使用）
  result = result.replace(
    /from\s+['"]@\/([^'"]+)['"]/g,
    `from '${packageName}/client/$lib/$1'`
  );

  return result;
}

/**
 * 检查文件是否需要转换
 */
export function shouldTransform(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return (
    ext.endsWith('.ts') ||
    ext.endsWith('.js') ||
    ext.endsWith('.svelte') ||
    ext.endsWith('.tsx') ||
    ext.endsWith('.jsx')
  );
}

/**
 * 获取文件的语言类型
 */
export function getFileLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    svelte: 'svelte',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
  };
  return langMap[ext] || 'plaintext';
}
