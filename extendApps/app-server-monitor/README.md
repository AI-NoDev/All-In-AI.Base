# ServerMonitor

@qiyu-allinai/app-server-monitor 扩展应用包。

## 目录结构

```
extendApps/app-server-monitor/
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
```

## 路由说明

- `client/routes/dashboard/` - 同步到 `/dashboard/app-server-monitor/`，使用 frontend 的 layout
- `client/routes/public/` - 同步到 `/public/`，独立页面（无 dashboard layout）
- 可以同时存在多种路由

## 开发

```bash
bun install
bun run dev
```
