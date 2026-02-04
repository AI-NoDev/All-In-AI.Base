# vite-plugin-sveltekit-page-meta

为 SvelteKit 项目自动生成页面元信息（meta），用于菜单生成、权限控制、页面名称/图标/分组管理。

## 安装

```bash
bun add -D vite-plugin-sveltekit-page-meta
```

## 使用

### 1. 配置 Vite 插件

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPageMetaPlugin } from 'vite-plugin-sveltekit-page-meta';

export default {
  plugins: [
    sveltekit(),
    SvelteKitPageMetaPlugin({
      output: 'src/lib/generated-pages.ts',
      ignore: [/components/, /__tests__/],
    })
  ]
};
```

### 2. 在页面中定义 _meta

```ts
// src/routes/dashboard/+page.ts
export const _meta = {
  title: 'Dashboard',
  permission: 'admin',
  icon: 'lucide:home',
  group: '平台',
  order: 1
};
```

> 注意：SvelteKit 要求自定义导出必须以 `_` 前缀命名

### 3. 使用生成的页面信息

```ts
import { pages, routeTitles, groupedPages } from '$lib/generated-pages';

// 所有页面
console.log(pages);
// [
//   { path: '/', title: 'Home', permission: 'guest', icon: 'home' },
//   { path: '/dashboard', title: 'Dashboard', permission: 'admin', icon: 'lucide:home' }
// ]

// 路由标题映射
console.log(routeTitles);
// { '/': 'Home', '/dashboard': 'Dashboard' }

// 分组页面
console.log(groupedPages);
// { '平台': [...], '设置': [...] }
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `routesDir` | `string` | `'src/routes'` | 扫描的路由目录 |
| `output` | `string` | `'src/lib/generated-pages.ts'` | 输出文件路径 |
| `ignore` | `(string \| RegExp)[]` | `[]` | 忽略的目录/文件 |
| `parseStrategy` | `'ast' \| 'regex'` | `'regex'` | 解析策略 |
| `dynamicRouteFormat` | `'bracket' \| 'colon' \| 'brace'` | `'bracket'` | 动态路由格式 |
| `generateTypes` | `boolean` | `true` | 是否生成类型定义 |
| `watch` | `boolean` | `true` | 是否监听文件变化 |

## Meta 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 页面标题 |
| `permission` | `string` | 权限标识 |
| `icon` | `string` | 图标 |
| `group` | `string` | 分组 |
| `order` | `number` | 排序 |
| `hidden` | `boolean` | 是否隐藏 |
| `breadcrumb` | `string[]` | 面包屑 |

## 动态路由格式

- `bracket` (默认): `/users/[id]` → `/users/[id]`
- `colon`: `/users/[id]` → `/users/:id`
- `brace`: `/users/[id]` → `/users/{id}`

## License

MIT
