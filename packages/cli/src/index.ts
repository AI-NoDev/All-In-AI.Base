import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import chalk from 'chalk';

interface AppConfig {
  name: string;
  packageName: string;
  displayName: string;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function findMonorepoRoot(): string {
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(join(dir, 'turbo.json')) || existsSync(join(dir, 'bun.lock'))) {
      return dir;
    }
    dir = resolve(dir, '..');
  }
  return process.cwd();
}

function generatePackageJson(config: AppConfig): string {
  return JSON.stringify({
    name: config.packageName,
    appName: `app-${config.name}`,
    version: '1.0.0',
    type: 'module',
    exports: {
      '.': './index.ts',
      './actions': './actions/index.ts',
      './client/$lib/*': './client/$lib/*',
      './client/routes/*': './client/routes/*',
      './server': './server/index.ts'
    },
    dependencies: {
      '@qiyu-allinai/actions': 'workspace:*',
      '@qiyu-allinai/db': 'workspace:*'
    },
    devDependencies: {
      svelte: '^5.0.0',
      typescript: '^5.0.0'
    }
  }, null, 2);
}

function generateIndexTs(config: AppConfig): string {
  return `// ${config.displayName} 扩展应用
export const APP_NAME = '${config.name}';
export const APP_DISPLAY_NAME = '${config.displayName}';
`;
}

function generateActionsIndex(config: AppConfig): string {
  const camelName = toCamelCase(config.name);
  
  return `import { defineAction } from '@qiyu-allinai/actions';
import { z } from 'zod';

// 示例 Action：获取列表
export const ${camelName}GetList = defineAction({
  meta: {
    name: 'app-${config.name}.getList',
    displayName: '获取${config.displayName}列表',
    description: '分页查询${config.displayName}数据',
    tags: ['app-${config.name}', 'query'],
    method: 'POST',
    path: '/api/app-${config.name}/list',
  },
  schemas: {
    bodySchema: z.object({
      filter: z.object({
        keyword: z.string().optional(),
      }).optional(),
      limit: z.number().max(100).default(20),
      offset: z.number().default(0),
    }),
    outputSchema: z.object({
      data: z.array(z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
      })),
      total: z.number(),
    }),
  },
  execute: async () => {
    // TODO: 实现业务逻辑
    return { data: [], total: 0 };
  },
});

// 导出 actions 数组（必须）
export const actions = [${camelName}GetList];
`;
}

// dashboard 路由的 +page.ts（有 _meta）
function generateDashboardPageTs(config: AppConfig): string {
  return `export const _meta = {
  title: '${config.displayName}',
  icon: 'tdesign:app',
  group: '扩展应用',
  order: 100,
  permission: 'app-${config.name}:view'
};
`;
}

// dashboard 路由的 +page.svelte
function generateDashboardPageSvelte(config: AppConfig): string {
  return `<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface ListItem {
    id: string;
    name: string;
    createdAt: string;
  }

  let items = $state<ListItem[]>([]);
  let loading = $state(false);

  async function loadData() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      // TODO: 调用 API
      // const res = await api.appXxx.postApiAppXxxList({ limit: 20, offset: 0 });
      // items = res.data.data;
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => loadData());
</script>

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <div class="py-4">
    <h1 class="text-xl font-semibold">${config.displayName}</h1>
    <p class="text-muted-foreground text-sm mt-1">这是 ${config.displayName} 扩展应用的首页</p>
  </div>

  <div class="flex-1 min-h-0">
    {#if loading}
      <div class="flex items-center justify-center h-32">
        <span class="text-muted-foreground">加载中...</span>
      </div>
    {:else if items.length === 0}
      <div class="flex items-center justify-center h-32 border rounded-md">
        <span class="text-muted-foreground">暂无数据</span>
      </div>
    {:else}
      <div class="space-y-2">
        {#each items as item}
          <div class="p-4 border rounded-md">
            <div class="font-medium">{item.name}</div>
            <div class="text-sm text-muted-foreground">{item.createdAt}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
`;
}

function generateServerIndex(config: AppConfig): string {
  return `import { Elysia } from 'elysia';

// ${config.displayName} Elysia 插件（可选）
export const app${toPascalCase(config.name)}Plugin = new Elysia({ prefix: '/app-${config.name}' })
  // 添加自定义路由或 WebSocket
  .get('/health', () => ({ status: 'ok', app: '${config.name}' }));
`;
}

function generateReadme(config: AppConfig): string {
  return `# ${config.displayName}

${config.packageName} 扩展应用包。

## 目录结构

\`\`\`
extendApps/app-${config.name}/
├── package.json          # 包配置
├── index.ts              # 包入口
├── actions/              # Actions 定义
│   └── index.ts
├── client/               # 前端代码
│   ├── routes/           # SvelteKit 路由
│   │   ├── dashboard/    # dashboard 下的路由（使用 frontend layout）
│   │   │   ├── +page.ts
│   │   │   └── +page.svelte
│   │   └── (root)/       # 根路由（独立页面，如 public/xxx）
│   └── $lib/             # 共享组件
│       └── components/
└── server/               # 后端代码
    └── index.ts
\`\`\`

## 路由说明

- \`client/routes/dashboard/\` - 同步到 \`/dashboard/app-${config.name}/\`，使用 frontend 的 layout
- \`client/routes/public/\` - 同步到 \`/public/\`，独立页面（无 dashboard layout）
- 可以同时存在多种路由

## 开发

\`\`\`bash
bun install
bun run dev
\`\`\`
`;
}


export async function createApp(name: string): Promise<void> {
  const kebabName = toKebabCase(name);
  const displayName = toPascalCase(name);
  
  const config: AppConfig = {
    name: kebabName,
    packageName: `@qiyu-allinai/app-${kebabName}`,
    displayName,
  };

  const root = findMonorepoRoot();
  const extendAppsDir = join(root, 'extendApps');
  const appDir = join(extendAppsDir, `app-${kebabName}`);

  if (!existsSync(extendAppsDir)) {
    mkdirSync(extendAppsDir, { recursive: true });
  }

  if (existsSync(appDir)) {
    console.error(chalk.red(`✗ 目录已存在: extendApps/app-${kebabName}`));
    process.exit(1);
  }

  console.log(chalk.blue(`\n创建扩展应用: ${config.packageName}\n`));

  // 创建目录结构（dashboard 路由默认在 routes/dashboard 下）
  const dirs = [
    '',
    'actions',
    'client',
    'client/routes',
    'client/routes/dashboard',  // dashboard 路由
    'client/$lib',
    'client/$lib/components',
    'server',
  ];

  for (const dir of dirs) {
    const fullPath = join(appDir, dir);
    mkdirSync(fullPath, { recursive: true });
    console.log(chalk.gray(`  创建目录: extendApps/app-${kebabName}/${dir || '.'}`));
  }

  // 创建文件（dashboard 路由放在 routes/dashboard 下）
  const files: Array<{ path: string; content: string }> = [
    { path: 'package.json', content: generatePackageJson(config) },
    { path: 'index.ts', content: generateIndexTs(config) },
    { path: 'actions/index.ts', content: generateActionsIndex(config) },
    { path: 'client/routes/dashboard/+page.ts', content: generateDashboardPageTs(config) },
    { path: 'client/routes/dashboard/+page.svelte', content: generateDashboardPageSvelte(config) },
    { path: 'server/index.ts', content: generateServerIndex(config) },
    { path: 'README.md', content: generateReadme(config) },
  ];

  for (const file of files) {
    const fullPath = join(appDir, file.path);
    writeFileSync(fullPath, file.content, 'utf-8');
    console.log(chalk.green(`  创建文件: extendApps/app-${kebabName}/${file.path}`));
  }

  console.log(chalk.blue('\n✓ 扩展应用创建成功!\n'));
  
  // 自动添加到 frontend 配置
  const frontendDir = join(root, 'apps', 'frontend');
  
  // 1. 添加到 frontend/package.json
  const frontendPkgPath = join(frontendDir, 'package.json');
  if (existsSync(frontendPkgPath)) {
    try {
      const frontendPkg = JSON.parse(readFileSync(frontendPkgPath, 'utf-8'));
      if (!frontendPkg.dependencies) {
        frontendPkg.dependencies = {};
      }
      if (!frontendPkg.dependencies[config.packageName]) {
        frontendPkg.dependencies[config.packageName] = 'workspace:*';
        writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, '\t'), 'utf-8');
        console.log(chalk.green(`  ✓ 已添加到 apps/frontend/package.json`));
      } else {
        console.log(chalk.gray(`  - apps/frontend/package.json 已包含此依赖`));
      }
    } catch (err) {
      console.log(chalk.yellow(`  ⚠ 无法更新 apps/frontend/package.json: ${err}`));
    }
  }
  
  // 2. 添加到 frontend/vite.config.ts
  const viteConfigPath = join(frontendDir, 'vite.config.ts');
  if (existsSync(viteConfigPath)) {
    try {
      let viteConfig = readFileSync(viteConfigPath, 'utf-8');
      const appEntry = `{ package: '${config.packageName}' }`;
      
      if (viteConfig.includes(config.packageName)) {
        console.log(chalk.gray(`  - vite.config.ts 已包含此扩展应用`));
      } else {
        const appsArrayRegex = /(extendsAppPlugin\s*\(\s*\{\s*apps\s*:\s*\[)([^\]]*?)(\s*\]\s*)/;
        const match = viteConfig.match(appsArrayRegex);
        
        if (match) {
          const existingApps = (match[2] || '').trim();
          let newApps: string;
          if (existingApps) {
            newApps = `${existingApps},\n                ${appEntry}`;
          } else {
            newApps = `\n                ${appEntry}\n            `;
          }
          viteConfig = viteConfig.replace(appsArrayRegex, `$1${newApps}$3`);
          writeFileSync(viteConfigPath, viteConfig, 'utf-8');
          console.log(chalk.green(`  ✓ 已添加到 apps/frontend/vite.config.ts`));
        } else {
          console.log(chalk.yellow(`  ⚠ 无法找到 extendsAppPlugin 配置，请手动添加`));
        }
      }
    } catch (err) {
      console.log(chalk.yellow(`  ⚠ 无法更新 vite.config.ts: ${err}`));
    }
  }

  console.log(chalk.yellow('\n下一步:'));
  console.log(chalk.gray(`  1. 在 ${chalk.cyan('apps/server/src/config/index.ts')} 中注册扩展包（如需后端）`));
  console.log(chalk.gray(`  2. 运行 ${chalk.cyan('bun run dev')} 启动开发服务器\n`));
  
  // 3. 自动运行 bun install
  console.log(chalk.blue('正在安装依赖...\n'));
  try {
    execSync('bun install', { cwd: root, stdio: 'inherit' });
    console.log(chalk.green('\n✓ 依赖安装完成!\n'));
  } catch {
    console.log(chalk.yellow(`\n⚠ 自动安装依赖失败，请手动运行 bun install\n`));
  }
}


function countFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  
  let count = 0;
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  
  return count;
}

async function confirm(message: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * 递归查找所有同步的路由目录
 */
function findSyncedRoutes(routesDir: string, packageName: string): string[] {
  const manifestPath = join(routesDir, '.extends-app-manifest.json');
  const syncedDirs: Set<string> = new Set();
  
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      for (const [targetPath, info] of Object.entries(manifest.files || {})) {
        if ((info as { package: string }).package === packageName) {
          // 获取目录路径
          const dir = join(routesDir, '..', targetPath.replace(/\/[^/]+$/, ''));
          syncedDirs.add(dir);
        }
      }
    } catch {
      // 忽略
    }
  }
  
  return Array.from(syncedDirs);
}

export async function removeApp(name: string): Promise<void> {
  const kebabName = toKebabCase(name);
  const packageName = `@qiyu-allinai/app-${kebabName}`;
  
  const root = findMonorepoRoot();
  const appDir = join(root, 'extendApps', `app-${kebabName}`);
  const frontendDir = join(root, 'apps', 'frontend');
  const routesDir = join(frontendDir, 'src', 'routes');
  
  console.log(chalk.blue(`\n删除扩展应用: ${packageName}\n`));
  
  let totalFiles = 0;
  const deletionPlan: Array<{ path: string; files: number; type: string }> = [];
  
  // 1. 扩展应用目录
  if (existsSync(appDir)) {
    const files = countFiles(appDir);
    deletionPlan.push({ path: `extendApps/app-${kebabName}/`, files, type: '扩展应用目录' });
    totalFiles += files;
  } else {
    console.log(chalk.yellow(`  ⚠ 扩展应用目录不存在: extendApps/app-${kebabName}`));
  }
  
  // 2. 查找所有同步的路由（从 manifest 读取）
  const syncedRoutes = findSyncedRoutes(routesDir, packageName);
  for (const syncedDir of syncedRoutes) {
    if (existsSync(syncedDir)) {
      const files = countFiles(syncedDir);
      const relativePath = syncedDir.replace(root + '/', '').replace(root + '\\', '');
      deletionPlan.push({ path: relativePath, files, type: '同步的路由' });
      totalFiles += files;
    }
  }
  
  // 3. frontend/package.json 中的依赖
  const frontendPkgPath = join(frontendDir, 'package.json');
  let hasDependency = false;
  if (existsSync(frontendPkgPath)) {
    const frontendPkg = JSON.parse(readFileSync(frontendPkgPath, 'utf-8'));
    if (frontendPkg.dependencies?.[packageName]) {
      hasDependency = true;
    }
  }
  
  // 4. vite.config.ts 中的配置
  const viteConfigPath = join(frontendDir, 'vite.config.ts');
  let hasViteConfig = false;
  if (existsSync(viteConfigPath)) {
    const viteConfig = readFileSync(viteConfigPath, 'utf-8');
    if (viteConfig.includes(packageName)) {
      hasViteConfig = true;
    }
  }
  
  if (totalFiles === 0 && !hasDependency && !hasViteConfig) {
    console.log(chalk.yellow(`  没有找到要删除的内容`));
    return;
  }
  
  console.log(chalk.yellow('将要删除的内容:\n'));
  
  for (const item of deletionPlan) {
    console.log(chalk.gray(`  📁 ${item.type}: ${item.path}`));
    console.log(chalk.gray(`     文件数: ${item.files}`));
  }
  
  if (hasDependency) {
    console.log(chalk.gray(`  📦 package.json 依赖: ${packageName}`));
  }
  
  if (hasViteConfig) {
    console.log(chalk.gray(`  ⚙️  vite.config.ts 配置`));
  }
  
  console.log(chalk.yellow(`\n总计: ${totalFiles} 个文件\n`));
  
  const confirmed = await confirm(chalk.red('确认删除? (y/N): '));
  
  if (!confirmed) {
    console.log(chalk.gray('\n已取消删除\n'));
    return;
  }
  
  console.log('');
  
  // 执行删除
  if (existsSync(appDir)) {
    rmSync(appDir, { recursive: true, force: true });
    console.log(chalk.green(`  ✓ 已删除 extendApps/app-${kebabName}/`));
  }
  
  for (const syncedDir of syncedRoutes) {
    if (existsSync(syncedDir)) {
      rmSync(syncedDir, { recursive: true, force: true });
      const relativePath = syncedDir.replace(root + '/', '').replace(root + '\\', '');
      console.log(chalk.green(`  ✓ 已删除 ${relativePath}`));
    }
  }
  
  if (hasDependency) {
    try {
      const frontendPkg = JSON.parse(readFileSync(frontendPkgPath, 'utf-8'));
      delete frontendPkg.dependencies[packageName];
      writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, '\t'), 'utf-8');
      console.log(chalk.green(`  ✓ 已从 package.json 移除依赖`));
    } catch (err) {
      console.log(chalk.yellow(`  ⚠ 无法更新 package.json: ${err}`));
    }
  }
  
  if (hasViteConfig) {
    try {
      let viteConfig = readFileSync(viteConfigPath, 'utf-8');
      const escapedPkgName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const appEntryRegex = new RegExp(
        `\\s*\\{\\s*package:\\s*['"]${escapedPkgName}['"][^}]*\\}\\s*,?`,
        'g'
      );
      viteConfig = viteConfig.replace(appEntryRegex, '');
      viteConfig = viteConfig.replace(/,(\s*\])/g, '$1');
      writeFileSync(viteConfigPath, viteConfig, 'utf-8');
      console.log(chalk.green(`  ✓ 已从 vite.config.ts 移除配置`));
    } catch (err) {
      console.log(chalk.yellow(`  ⚠ 无法更新 vite.config.ts: ${err}`));
    }
  }
  
  // 清理 manifest
  const manifestPath = join(routesDir, '.extends-app-manifest.json');
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      let changed = false;
      
      for (const key of Object.keys(manifest.files || {})) {
        if (manifest.files[key].package === packageName) {
          delete manifest.files[key];
          changed = true;
        }
      }
      
      if (changed) {
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(chalk.green(`  ✓ 已更新 manifest`));
      }
    } catch {
      // 忽略
    }
  }
  
  console.log(chalk.blue('\n✓ 扩展应用删除成功!\n'));
  
  console.log(chalk.blue('正在更新依赖...\n'));
  try {
    execSync('bun install', { cwd: root, stdio: 'inherit' });
    console.log(chalk.green('\n✓ 依赖更新完成!\n'));
  } catch {
    console.log(chalk.yellow(`\n⚠ 依赖更新失败，请手动运行 bun install\n`));
  }
}
