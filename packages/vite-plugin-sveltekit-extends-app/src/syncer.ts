/**
 * 文件同步器 v4
 * - 根据扩展应用的目录结构自动同步
 * - client/routes/dashboard/* -> routes/dashboard/{appName}/*
 * - client/routes/public/* -> routes/public/*
 * - client/routes/其他/* -> routes/其他/*
 * - +page.ts 直接复制（包含 _meta）
 * - +page.svelte 生成代理文件
 */

import * as path from 'node:path';
import * as fs from 'node:fs';
import type { ExtendAppConfig, SyncManifest } from './types';
import { 
  getAllFiles, 
  normalizePath, 
  fileExists, 
  writeFile, 
} from './utils';
import { 
  readManifest, 
  writeManifest, 
  addSyncRecord, 
  cleanOrphanedFiles,
  isManagedFile 
} from './manifest';

interface SyncResult {
  synced: string[];
  skipped: string[];
  errors: string[];
}

interface PackageInfo {
  path: string;
  appName: string;
}

function findMonorepoRoot(): string {
  let dir = process.cwd();
  const root = path.parse(dir).root;
  while (dir !== root) {
    if (fs.existsSync(path.join(dir, 'turbo.json')) || fs.existsSync(path.join(dir, 'bun.lock'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function resolvePackageInfo(packageName: string): PackageInfo | null {
  const cwd = process.cwd();
  const monorepoRoot = findMonorepoRoot();
  const packageShortName = packageName.split('/').pop() || '';
  
  const searchPaths = [
    path.join(cwd, 'node_modules', packageName),
    path.join(monorepoRoot, 'node_modules', packageName),
    path.join(monorepoRoot, 'extendApps', packageShortName),
    path.join(monorepoRoot, 'packages', packageShortName),
  ];
  
  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      const pkgJsonPath = path.join(searchPath, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
          const appName = pkgJson.appName || pkgJson.name || packageShortName;
          return { path: searchPath, appName };
        } catch {
          return { path: searchPath, appName: packageShortName };
        }
      }
    }
  }
  
  try {
    const packageJsonPath = require.resolve(`${packageName}/package.json`, {
      paths: [cwd, monorepoRoot],
    });
    const pkgPath = path.dirname(packageJsonPath);
    try {
      const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const appName = pkgJson.appName || pkgJson.name || packageShortName;
      return { path: pkgPath, appName };
    } catch {
      return { path: pkgPath, appName: packageShortName };
    }
  } catch {
    return null;
  }
}

function generateProxyPageTs(packageName: string, routePath: string): string {
  const importPath = `${packageName}/client/routes${routePath}/+page`;
  return `// Auto-generated proxy file - DO NOT EDIT
export * from '${importPath}';
`;
}

function generateProxyPageSvelte(packageName: string, routePath: string): string {
  const importPath = `${packageName}/client/routes${routePath}/+page.svelte`;
  return `<!-- Auto-generated proxy file - DO NOT EDIT -->
<script>
  import Page from '${importPath}';
</script>

<Page />
`;
}

function generateProxyLayoutTs(packageName: string, routePath: string): string {
  const importPath = `${packageName}/client/routes${routePath}/+layout`;
  return `// Auto-generated proxy file - DO NOT EDIT
export * from '${importPath}';
`;
}

function generateProxyLayoutSvelte(packageName: string, routePath: string): string {
  const importPath = `${packageName}/client/routes${routePath}/+layout.svelte`;
  return `<!-- Auto-generated proxy file - DO NOT EDIT -->
<script>
  import Layout from '${importPath}';
  let { children } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
`;
}

/**
 * 计算目标路径
 * - dashboard/* -> dashboard/{appName}/*
 * - 其他路径保持原样
 */
function computeTargetPath(relativePath: string, appName: string): string {
  const normalized = relativePath.replace(/\\/g, '/');
  
  // dashboard 下的路由：添加 appName
  if (normalized.startsWith('dashboard/')) {
    return `dashboard/${appName}/${normalized.slice('dashboard/'.length)}`;
  }
  if (normalized === 'dashboard') {
    return `dashboard/${appName}`;
  }
  
  // 其他路径保持原样（如 public/xxx）
  return normalized;
}

export function syncPackageRoutes(
  appConfig: ExtendAppConfig,
  routesDir: string,
  manifest: SyncManifest,
  logLevel: string
): SyncResult {
  const result: SyncResult = {
    synced: [],
    skipped: [],
    errors: [],
  };

  const packageInfo = resolvePackageInfo(appConfig.package);
  if (!packageInfo) {
    result.errors.push(`Package not found: ${appConfig.package}`);
    return result;
  }

  const sourceRoutesDir = path.join(packageInfo.path, 'client', 'routes');
  if (!fs.existsSync(sourceRoutesDir)) {
    if (logLevel === 'debug') {
      console.log(`[extends-app] No routes found in ${appConfig.package}`);
    }
    return result;
  }

  if (logLevel === 'debug') {
    console.log(`[extends-app] Package: ${appConfig.package}, appName: ${packageInfo.appName}`);
  }

  const sourceFiles = getAllFiles(sourceRoutesDir).filter(f => {
    const basename = path.basename(f);
    return basename === '+page.ts' || 
           basename === '+page.svelte' || 
           basename === '+layout.ts' || 
           basename === '+layout.svelte';
  });
  
  const sourceFileSet = new Set(sourceFiles.map(f => normalizePath(f)));

  const cleaned = cleanOrphanedFiles(manifest, routesDir, sourceFileSet, appConfig.package);
  if (cleaned.length > 0 && logLevel !== 'error') {
    console.log(`[extends-app] Cleaned ${cleaned.length} orphaned files from ${appConfig.package}`);
  }

  for (const sourceFile of sourceFiles) {
    const relativeFromRoutes = path.relative(sourceRoutesDir, sourceFile);
    const relativeDir = path.dirname(relativeFromRoutes);
    const basename = path.basename(sourceFile);
    
    // 计算目标路径
    const targetRelativeDir = computeTargetPath(relativeDir, packageInfo.appName);
    const targetFile = path.join(routesDir, targetRelativeDir, basename);
    const normalizedTarget = normalizePath(targetFile);
    
    // 计算用于 import 的路由路径
    const routePath = '/' + relativeDir.replace(/\\/g, '/');
    const routePathNormalized = routePath === '/.' ? '' : routePath;

    try {
      if (fileExists(targetFile) && !isManagedFile(manifest, normalizedTarget)) {
        result.skipped.push(relativeFromRoutes);
        if (logLevel === 'debug') {
          console.log(`[extends-app] Skipped (exists): ${relativeFromRoutes}`);
        }
        continue;
      }

      let content: string;
      
      // 所有文件都生成代理导入
      if (basename === '+page.ts') {
        content = generateProxyPageTs(appConfig.package, routePathNormalized);
      } else if (basename === '+page.svelte') {
        content = generateProxyPageSvelte(appConfig.package, routePathNormalized);
      } else if (basename === '+layout.ts') {
        content = generateProxyLayoutTs(appConfig.package, routePathNormalized);
      } else if (basename === '+layout.svelte') {
        content = generateProxyLayoutSvelte(appConfig.package, routePathNormalized);
      } else {
        continue;
      }

      writeFile(targetFile, content);
      addSyncRecord(manifest, normalizePath(sourceFile), normalizedTarget, appConfig.package);
      result.synced.push(relativeFromRoutes);

      if (logLevel === 'debug') {
        console.log(`[extends-app] Synced: ${relativeFromRoutes} -> ${targetRelativeDir}/${basename}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(`${relativeFromRoutes}: ${errorMsg}`);
    }
  }

  return result;
}

export function syncAllPackages(
  apps: ExtendAppConfig[],
  routesDir: string,
  logLevel: string
): void {
  const manifest = readManifest(routesDir);
  
  let totalSynced = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const app of apps) {
    if (app.enabled === false) continue;

    const result = syncPackageRoutes(app, routesDir, manifest, logLevel);
    totalSynced += result.synced.length;
    totalSkipped += result.skipped.length;
    totalErrors += result.errors.length;

    if (result.errors.length > 0 && logLevel !== 'error') {
      console.error(`[extends-app] Errors in ${app.package}:`, result.errors);
    }
  }

  writeManifest(routesDir, manifest);

  if (logLevel !== 'error') {
    console.log(
      `[extends-app] Sync complete: ${totalSynced} synced, ${totalSkipped} skipped, ${totalErrors} errors`
    );
  }
}
