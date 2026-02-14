# vite-plugin-sveltekit-extends-app

用于扩展 SvelteKit 应用的 Vite 插件，支持从 monorepo 中的扩展包自动同步路由和组件。

## 功能特性

- 🔄 自动同步扩展包的 `client/routes` 到主应用
- 🔀 自动转换导入路径（`$lib` -> `@package/client/$lib`）
- 📝 清单文件跟踪，支持增量更新
- 🚫 不覆盖已存在的文件
- 👀 开发模式下监听源文件变化

## 安装

```bash
bun add vite-plugin-sveltekit-extends-app -D
```

## 使用方法

### 前端配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { extendsAppPlugin } from 'vite-plugin-sveltekit-extends-app';

export default defineConfig({
  plugins: [
    sveltekit(),
    extendsAppPlugin({
      apps: [
        { package: '@qiyu-allinai/app-crm', basePath: '/dashboard/crm' },
        { package: '@qiyu-allinai/app-erp', basePath: '/dashboard/erp', enabled: false },
      ],
    }),
  ],
});
```

### 后端配置 (config/index.ts)

```typescript
import { config } from './config';

// 配置扩展包
config.extendsPluginPackages = [
  { package: '@qiyu-allinai/app-crm' },
  { package: '@qiyu-allinai/app-erp', enabled: false },
];
```

### 后端加载 Actions (app.ts)

```typescript
import { loadExtendedActions } from './config';
import { actionsPlugin } from './plugins';

// 加载扩展包的 actions
const extendedActions = await loadExtendedActions();

export const app = base
  .use(actionsPlugin([...dbActions, ...extendedActions]));
```

## 扩展包结构

扩展包需要遵循以下目录结构：

```
packages/app-xxx/
├── package.json
├── actions/              # Actions 导出（后端自动加载）
│   └── index.ts          # export const actions = [...]
├── client/
│   ├── routes/           # SvelteKit 路由（自动同步）
│   │   └── +page.svelte
│   └── $lib/             # 共享组件/工具
│       └── components/
└── server/               # 可选：Elysia 插件
    └── index.ts
```

### package.json 配置

```json
{
  "name": "@qiyu-allinai/app-xxx",
  "exports": {
    ".": "./index.ts",
    "./actions": "./actions/index.ts",
    "./client/$lib/*": "./client/$lib/*"
  }
}
```

### Actions 导出示例

```typescript
// actions/index.ts
import { defineAction } from '@qiyu-allinai/actions';

export const myAction = defineAction({
  meta: {
    name: 'app-xxx.myAction',
    method: 'GET',
    path: '/api/app-xxx/my-action',
  },
  // ...
});

// 导出 actions 数组
export const actions = [myAction];
```

## 配置选项

### PluginOptions

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apps` | `ExtendAppConfig[]` | `[]` | 扩展应用配置列表 |
| `routesDir` | `string` | `'src/routes'` | 主应用 routes 目录 |
| `watch` | `boolean` | `true` | 是否监听源文件变化 |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error'` | `'info'` | 日志级别 |

### ExtendAppConfig

| 选项 | 类型 | 说明 |
|------|------|------|
| `package` | `string` | 包名，如 `@qiyu-allinai/app-xxx` |
| `basePath` | `string` | 路由基础路径，如 `/dashboard/app-xxx` |
| `enabled` | `boolean` | 是否启用，默认 `true` |

## 导入路径转换

插件会自动转换以下导入路径：

```typescript
// 转换前
import { Button } from '$lib/components/ui/button';
import { utils } from '@/utils';

// 转换后
import { Button } from '@qiyu-allinai/app-xxx/client/$lib/components/ui/button';
import { utils } from '@qiyu-allinai/app-xxx/client/$lib/components/ui/utils';
```

## 清单文件

插件会在 `routesDir` 下生成 `.extends-app-manifest.json` 文件，用于跟踪已同步的文件。

建议将此文件添加到 `.gitignore`：

```gitignore
.extends-app-manifest.json
```

## License

MIT
