# 项目结构

本项目采用 Turborepo monorepo 架构，包含前端、后端和多个共享包。

## 目录概览

```
ai-drive-system/
├── apps/
│   ├── frontend/          # SvelteKit 前端应用
│   └── server/            # Elysia 后端服务
├── packages/
│   ├── db/                # 数据库实体和连接
│   ├── actions/           # 业务逻辑 Actions
│   ├── i18n/              # 国际化翻译
│   └── vite-plugin-*/     # Vite 插件
├── turbo.json             # Turborepo 配置
├── package.json           # 根 package.json
└── bun.lock               # Bun 锁文件
```

## apps/frontend - 前端应用

SvelteKit + shadcn-svelte 构建的管理后台。

```
apps/frontend/
├── src/
│   ├── lib/
│   │   ├── api/           # 生成的 API 客户端（openapi-ts）
│   │   ├── components/    # 通用组件
│   │   │   └── ui/        # shadcn-svelte 组件
│   │   ├── stores/        # Svelte 状态管理
│   │   │   ├── auth.svelte.ts   # 认证状态
│   │   │   └── tabs.svelte.ts   # 标签页状态
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── utils.ts       # 工具函数
│   ├── routes/
│   │   ├── login/         # 登录页
│   │   ├── dashboard/     # 后台页面
│   │   │   ├── system/    # 系统管理
│   │   │   ├── ai/        # AI 管理
│   │   │   └── knowledge/ # 知识库
│   │   └── docs/          # 开发文档
│   └── app.html           # HTML 模板
├── static/                # 静态资源
├── svelte.config.js       # SvelteKit 配置
├── vite.config.ts         # Vite 配置
└── package.json
```

### 页面元数据

每个页面通过 `+page.ts` 导出 `_meta` 对象，用于导航和权限控制：

```typescript
// +page.ts
export const _meta = {
  title: 'nav.title.users',      // 页面标题（i18n key）
  icon: 'tdesign:user',          // 图标
  group: 'nav.group.system',     // 分组
  order: 10,                     // 排序
  permission: 'system:user:view' // 权限标识
};
```

构建时会自动生成 `src/lib/generated-pages.ts`，包含所有页面的元数据。

## apps/server - 后端服务

Elysia 框架的 HTTP 服务。

```
apps/server/
├── src/
│   ├── config/            # 配置文件
│   ├── server/
│   │   ├── app.ts         # 主应用（Action 注册）
│   │   ├── base.ts        # Elysia 基础实例
│   │   ├── plugins/       # Elysia 插件
│   │   │   ├── jwt.ts     # JWT 认证
│   │   │   ├── cors.ts    # CORS
│   │   │   ├── openapi.ts # OpenAPI 文档
│   │   │   ├── actions.ts # Action 路由注册
│   │   │   └── ...
│   │   └── index.ts       # 服务入口
│   └── routers/           # 自定义路由（如 auth）
├── .env                   # 环境变量
└── package.json
```

### Action 注册流程

```typescript
// apps/server/src/server/app.ts
import { dbActions, filesActions } from "@qiyu-allinai/actions";
import { actionsPlugin } from "./plugins";

const coreActions = [...dbActions, ...filesActions];

async function createApp() {
  return base
    .use(corsPlugin)
    .use(jwtPlugin)
    // ... 其他插件
    .use(actionsPlugin(coreActions));  // 注册所有 Actions
}
```

## packages/db - 数据库层

定义数据库实体、关系和 TypeBox Schema（使用 drizzle-typebox）。

```
packages/db/
├── src/
│   ├── connect/           # 数据库连接
│   │   └── index.ts       # Drizzle 实例
│   ├── entities/          # 实体定义
│   │   ├── base/          # 基础 Schema
│   │   │   ├── pkSchema.ts      # 主键
│   │   │   ├── auditSchema.ts   # 审计字段
│   │   │   └── deletedSchema.ts # 软删除
│   │   ├── system/        # 系统模块
│   │   ├── ai/            # AI 模块
│   │   ├── im/            # 即时通讯
│   │   └── knowledge/     # 知识库
│   ├── seedData/          # 种子数据
│   └── utils/             # 工具函数
│       └── entity.ts      # 实体工具
├── drizzle/               # 迁移文件
└── drizzle.config.ts      # Drizzle 配置
```

### 实体文件结构

每个实体文件导出：

```typescript
// packages/db/src/entities/system/user.ts

// 1. 字段定义
export const userFields = mergeFields(pkSchema, auditSchema, deletedSchema, userOwnFields);

// 2. 元数据
export const userMeta: EntityMeta = { ... };

// 3. 表定义
export const user = pgTable(userMeta.name, getTableFields(userFields));

// 4. 字段配置（导入导出）
export const userConfig = getFieldConfigs(userFields);

// 5. TypeBox Schemas（使用 drizzle-typebox）
export const userSchemas = createTypeboxSchemas(user, userFields);
```

## packages/actions - 业务逻辑层

定义 API 接口的业务逻辑。

```
packages/actions/
├── src/
│   ├── core/              # 核心定义
│   │   ├── define.ts      # defineAction 函数
│   │   ├── types.ts       # 类型定义
│   │   ├── errors.ts      # 错误类
│   │   └── registry.ts    # Action 注册表
│   ├── db/                # 数据库 Actions
│   │   ├── system/        # 系统模块
│   │   │   ├── user/      # 用户 Actions
│   │   │   ├── role/      # 角色 Actions
│   │   │   └── ...
│   │   ├── ai/            # AI 模块
│   │   ├── im/            # 即时通讯
│   │   └── knowledge/     # 知识库
│   └── index.ts           # 导出所有 Actions
└── package.json
```

### Action 文件结构

每个实体的 Actions 放在独立目录：

```
packages/actions/src/db/system/user/
├── index.ts           # 导出所有 Actions
├── schemas.ts         # 共享 Schema
├── utils.ts           # 工具函数
├── getByPagination.ts # 分页查询
├── getByPk.ts         # 根据 ID 查询
├── create.ts          # 创建
├── update.ts          # 更新
├── deleteByPk.ts      # 删除
└── getSchema.ts       # 获取 Schema
```

## packages/i18n - 国际化

基于 Paraglide 的国际化支持。

```
packages/i18n/
├── src/
│   ├── messages/          # 翻译消息
│   │   ├── zh-CN.json     # 中文
│   │   └── en.json        # 英文
│   └── index.ts           # 导出翻译函数
└── package.json
```

## 工作区依赖

在 `package.json` 中使用 `workspace:*` 引用内部包：

```json
{
  "dependencies": {
    "@qiyu-allinai/db": "workspace:*",
    "@qiyu-allinai/actions": "workspace:*",
    "@qiyu-allinai/i18n": "workspace:*"
  }
}
```

## Turborepo 任务

`turbo.json` 定义了任务依赖关系：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".svelte-kit/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "check-types": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 下一步

- [实体开发](/docs/zh-CN/backend/entities) - 学习如何定义数据库实体
- [Action 开发](/docs/zh-CN/backend/actions) - 学习如何创建 API 接口
- [前端组件](/docs/zh-CN/frontend/components) - 学习前端开发模式
