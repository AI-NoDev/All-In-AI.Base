---
inclusion: always
---

# 项目架构与模块说明

## 项目概述

AI Drive System 是一个企业级管理系统，采用 Turborepo monorepo 架构，包含前端、后端和多个共享包。

## 目录结构

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
```

---

## 菜单结构与种子数据

### 知识库菜单结构

知识库是一个菜单分组（目录），包含 4 个子菜单页面，不是单页面内的 Tab：

```
知识库 (KNOWLEDGE) - 目录 type='M'
├── 我的知识库 (MY_FILES) - /dashboard/knowledge/my-files
│   - 完整文件管理：创建、上传、删除、编辑、共享、复制/粘贴
│   - 权限：knowledge:view
├── 收到的共享 (SHARED_WITH_ME) - /dashboard/knowledge/shared-with-me
│   - 他人共享给当前用户的文件（根据权限只读或可编辑）
│   - 权限：knowledge:view
├── 我的共享 (MY_SHARED) - /dashboard/knowledge/my-shared
│   - 当前用户共享给他人的文件（可修改共享设置）
│   - 权限：knowledge:view
└── 收藏 (FAVORITES) - /dashboard/knowledge/favorites
    - 收藏的文件和文件夹（可查看和取消收藏）
    - 权限：knowledge:view
```

### 菜单种子数据

位于 `packages/db/src/seedData/menu.ts`，使用固定 UUID 确保数据一致性：

```typescript
const MENU_IDS = {
  // 知识库目录
  KNOWLEDGE: '10000000-0000-0000-0000-000000000007',
  // 知识库子菜单
  MY_FILES: '20000000-0000-0000-0000-000000000040',
  SHARED_WITH_ME: '20000000-0000-0000-0000-000000000041',
  MY_SHARED: '20000000-0000-0000-0000-000000000042',
  FAVORITES: '20000000-0000-0000-0000-000000000043',
};
```

### 角色菜单关联

位于 `packages/db/src/seedData/roleMenu.ts`，配置各角色可访问的菜单：

```typescript
// 管理员和普通用户都可以访问知识库
const adminMenus = [
  MENU_IDS.KNOWLEDGE,
  MENU_IDS.MY_FILES,
  MENU_IDS.SHARED_WITH_ME,
  MENU_IDS.MY_SHARED,
  MENU_IDS.FAVORITES,
  // ...
];
```

### 相关 API Actions

- `packages/actions/src/files/fileShare.ts` - 共享相关
  - `fileShareGetMyShared` - 获取我共享的资源
  - `fileShareGetSharedWithMe` - 获取收到的共享
- `packages/actions/src/db/knowledge/favorite/index.ts` - 收藏相关
  - `favoriteAdd` - 添加收藏
  - `favoriteRemove` - 取消收藏
  - `favoriteCheck` - 检查收藏状态
  - `favoriteList` - 获取收藏列表

---

## packages/db - 数据库层

### 作用
定义数据库实体（表结构）、关系和 TypeBox Schema，使用 Drizzle ORM 和 drizzle-typebox。

### 目录结构
```
packages/db/
├── src/
│   ├── connect/           # 数据库连接配置
│   ├── entities/          # 实体定义
│   │   ├── base/          # 基础 Schema（审计、软删除、权限）
│   │   ├── system/        # 系统管理（用户、角色、菜单、部门等）
│   │   ├── ai/            # AI 模块（Agent、Model、Provider 等）
│   │   ├── im/            # 即时通讯（会话、消息等）
│   │   └── knowledge/     # 知识库（文件、文件夹等）
│   └── utils/             # 工具函数
├── drizzle/               # 迁移文件
└── drizzle.config.ts      # Drizzle 配置
```

### 实体定义规范
```typescript
// 每个实体文件导出：
export const tableName = pgTable('table_name', { ... });
export const tableNameSchemas = {
  select: t.Object({ ... }),   // 查询返回类型
  insert: t.Object({ ... }),   // 插入类型
  update: t.Object({ ... }),   // 更新类型
};
```

### 基础 Schema
- `pkSchema` - 主键（UUID）
- `auditSchema` - 审计字段（createdBy, updatedBy, createdAt, updatedAt）
- `deletedSchema` - 软删除字段（deletedAt, deletedBy, deletedById）
- `permissionSchema` - 权限字段（deptId, permissionScope）

---

## packages/actions - 业务逻辑层

### 作用
定义 API 接口的业务逻辑，使用 `defineAction` 创建标准化的 CRUD 操作。

### 目录结构
```
packages/actions/
├── src/
│   ├── core/              # 核心定义
│   │   ├── define.ts      # defineAction 函数
│   │   ├── types.ts       # 类型定义（ActionContext 等）
│   │   ├── schema.ts      # Schema 转换工具
│   │   └── registry.ts    # Action 注册表
│   ├── db/                # 数据库 Actions
│   │   ├── system/        # 系统管理 Actions
│   │   ├── ai/            # AI 模块 Actions
│   │   ├── im/            # 即时通讯 Actions
│   │   └── knowledge/     # 知识库 Actions
│   └── filter/            # 过滤器定义
```

### Action 定义规范
```typescript
export const entityGetByPagination = defineAction({
  meta: {
    name: 'module.entity.getByPagination',
    displayName: '分页查询',
    description: '分页查询列表',
    tags: ['module', 'entity', 'query'],
    method: 'POST',
    path: '/api/module/entity/query'
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: t.Object({ data: t.Array(entitySchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    // 业务逻辑
  },
});
```

### ActionContext 类型
```typescript
interface ActionContext {
  currentUserId: string;    // 当前用户 ID（必填）
  currentUserName: string;  // 当前用户名（必填）
  // 其他上下文...
}
```

---

## packages/i18n - 国际化

### 作用
提供多语言翻译支持，目前支持中文（zh-CN）和英文（en）。

### 目录结构
```
packages/i18n/
├── src/
│   ├── locales/
│   │   ├── zh-CN/         # 中文翻译
│   │   │   ├── common.ts  # 通用翻译
│   │   │   ├── error.ts   # 错误消息
│   │   │   ├── validation.ts # 验证消息
│   │   │   └── db/        # 数据库字段翻译
│   │   └── en/            # 英文翻译
│   └── types.ts           # 类型定义
```

### 翻译 Key 规范
- 错误消息：`error.module.action` 如 `error.system.admin.cannot.modify`
- 字段名：`db.module.entity.field` 如 `db.system.user.loginName`
- 通用：`common.action` 如 `common.save`, `common.cancel`

---

## apps/server - 后端服务

### 作用
Elysia 框架的 HTTP 服务，提供 RESTful API。

### 目录结构
```
apps/server/
├── src/
│   ├── config/            # 配置
│   ├── server/
│   │   ├── app.ts         # 主应用（Action 转路由）
│   │   ├── plugins/       # Elysia 插件
│   │   │   ├── jwt.ts     # JWT 认证
│   │   │   ├── cors.ts    # CORS
│   │   │   ├── openapi.ts # OpenAPI 文档
│   │   │   └── ...
│   │   └── index.ts       # 服务入口
│   └── routers/           # 自定义路由（如 auth）
```

### app.ts 职责
- 将 Actions 转换为 Elysia 路由
- 从 JWT Token 获取用户信息注入 ActionContext
- 统一错误处理和响应格式

---

## apps/frontend - 前端应用

### 作用
SvelteKit + shadcn-svelte 的管理后台界面。

### 目录结构
```
apps/frontend/
├── src/
│   ├── lib/
│   │   ├── api/           # 生成的 API 客户端
│   │   ├── components/    # UI 组件
│   │   │   └── ui/        # shadcn-svelte 组件
│   │   ├── stores/        # Svelte 状态管理
│   │   │   ├── auth.svelte.ts  # 认证状态
│   │   │   ├── i18n.svelte.ts  # 国际化
│   │   │   └── tabs.svelte.ts  # 标签页
│   │   └── hooks/         # 自定义 Hooks
│   └── routes/
│       ├── login/         # 登录页
│       └── dashboard/     # 后台页面
│           ├── system/    # 系统管理
│           ├── ai/        # AI 管理
│           └── ...
```

### 页面元数据
每个页面的 `+page.ts` 导出 `_meta` 用于导航和权限：
```typescript
export const _meta = {
  title: '用户管理',
  icon: 'tdesign:user',
  group: '系统管理',
  order: 10,
  permission: 'system:user:view'
};
```

### auth.svelte.ts 功能
- Token 管理（accessToken, refreshToken）
- 自动刷新 Token（401 时）
- 自动注入审计字段（createdBy, updatedBy）
- 公共 HttpClient 实例
