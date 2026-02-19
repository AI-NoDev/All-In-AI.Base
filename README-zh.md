<p align="center">
  <img src="apps/frontend/src/lib/assets/logo.png" alt="Qiyu AllInAI Logo" width="120" />
  <h1 align="center">Qiyu AllInAI</h1>
  <p align="center">
    <strong>企业级 AI 应用基座系统</strong>
    <br />
    <em>Enterprise-grade AI Application Foundation Platform</em>
  </p>
  <p align="center">
    <a href="#功能特性">功能特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#模块说明">模块说明</a> •
    <a href="#二次开发">二次开发</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/status-active%20development-yellow" alt="Status" />
    <img src="https://img.shields.io/badge/AI%20features-expanding-blue" alt="AI Features" />
  </p>
</p>

> ⚠️ **开发中提示**: 部分 AI 高级功能正在加速扩展中，敬请期待更多强大的 AI 能力！

---

## 💡 灵感来源

本项目的设计灵感来自两个优秀的开源项目：

- **[Vercel AI SDK](https://sdk.vercel.ai)** - 现代化的 AI 应用开发工具包，提供了优雅的 AI 集成方案和工具调用模式
- **[RuoYi](https://ruoyi.vip)** - 成熟的企业级管理系统，提供了完善的 RBAC 权限模型和系统管理功能

我们将 Vercel AI 的现代 AI 能力与 RuoYi 的企业级管理功能相结合，并采用高性能的现代技术栈实现：

- ⚡ **[Bun](https://bun.sh)** - 极速 JavaScript 运行时，比 Node.js 快 4 倍
- 🦊 **[Elysia](https://elysiajs.com)** - 为 Bun 优化的高性能 TypeScript Web 框架
- 🔥 **[SvelteKit](https://kit.svelte.dev)** - 编译时优化的现代前端框架，零运行时开销

打造一个**开箱即用、性能卓越的 AI 应用基座**。

---

## 📖 项目简介

Qiyu AllInAI 是一个**开箱即用的 AI 应用基座系统**，为企业和开发者提供构建 AI 应用所需的完整基础设施。无论是构建智能客服、知识库问答、AI 助手还是其他 AI 驱动的应用，都可以基于本系统进行快速二次开发。

### 🎯 设计目标

- **开箱即用** - 提供完整的用户管理、权限控制、AI 模型管理等基础功能
- **高度可扩展** - 模块化架构设计，支持灵活的功能扩展和定制
- **现代化技术栈** - 采用 Bun + SvelteKit + Elysia 等现代技术，性能卓越
- **AI 原生** - 内置 AI Agent、工具编排等 AI 核心能力
- **企业级** - 完善的 RBAC 权限、审计日志、多租户支持

---

## ✨ 功能特性

### 🔐 系统管理
- **用户管理** - 用户 CRUD、状态管理、密码重置
- **角色管理** - 灵活的角色定义和权限分配
- **菜单管理** - 动态菜单配置，支持权限控制
- **部门管理** - 树形组织架构管理
- **岗位管理** - 岗位定义和用户关联
- **字典管理** - 系统字典和业务字典配置
- **系统配置** - 全局参数配置管理
- **操作日志** - 完整的操作审计追踪
- **登录日志** - 用户登录记录和安全监控
- **定时任务** - Cron 任务调度和执行日志

### 🤖 AI 模块
- **模型管理** - 多 AI 提供商（OpenAI、Anthropic、Azure 等）模型配置
- **Agent 管理** - AI Agent 创建、配置和会话管理
- **工具管理** - AI 工具定义和分组管理
- **工作流编辑器** - 可视化 AI 工作流编排（Actions Flow Editor）

### 💬 即时通讯 (IM)
- **私聊/群聊** - 支持一对一和群组会话
- **消息类型** - 文本、图片、文件、链接等多种消息格式
- **WebSocket** - 实时消息推送
- **消息已读** - 已读状态追踪
- **群组管理** - 群成员、群主、管理员角色

### 📁 知识库
- **文件管理** - 文件夹和文件的 CRUD 操作
- **版本控制** - 文件版本历史和回滚
- **权限控制** - 细粒度的资源访问权限
- **在线编辑** - Markdown 文档在线编辑
- **文件搜索** - 全文搜索支持

### 🎨 UI/UX
- **深色/浅色主题** - 完整的主题切换支持
- **响应式设计** - 适配桌面和移动端
- **国际化** - 中英文双语支持
- **shadcn-svelte** - 精美的 UI 组件库

---

## 🛠 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **运行时** | [Bun](https://bun.sh) | 高性能 JavaScript 运行时和包管理器 |
| **Monorepo** | [Turborepo](https://turbo.build) | 高效的 Monorepo 构建系统 |
| **前端框架** | [SvelteKit](https://kit.svelte.dev) | Svelte 5 全栈框架 |
| **UI 组件** | [shadcn-svelte](https://shadcn-svelte.com) | 精美的 Svelte UI 组件库 |
| **样式** | [Tailwind CSS v4](https://tailwindcss.com) | 原子化 CSS 框架 |
| **后端框架** | [Elysia](https://elysiajs.com) | 高性能 TypeScript Web 框架 |
| **数据库** | [PostgreSQL](https://postgresql.org) | 关系型数据库 |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | 类型安全的 TypeScript ORM |
| **验证** | [Zod](https://zod.dev) | TypeScript-first Schema 验证 |
| **对象存储** | [MinIO](https://min.io) / S3 | 文件存储服务 |
| **API 文档** | OpenAPI / Swagger | 自动生成 API 文档 |

---

## 🚀 快速开始

### 环境要求

- [Bun](https://bun.sh) >= 1.3.6
- [PostgreSQL](https://postgresql.org) >= 14
- [MinIO](https://min.io) 或 S3 兼容存储（可选）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-org/qiyu-allinai.git
cd qiyu-allinai

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp packages/db/.env.example packages/db/.env
cp apps/server/.env.example apps/server/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. 初始化数据库
bun run --filter=@qiyu-allinai/db migrate
bun run --filter=@qiyu-allinai/db seed

# 5. 启动开发服务器
bun run dev
```

### 访问地址

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000
- API 文档: http://localhost:3000/swagger

### 默认账号

- 用户名: `admin`
- 密码: `admin123`

---

## 📁 项目结构

```
qiyu-allinai/
├── apps/
│   ├── frontend/              # SvelteKit 前端应用
│   │   ├── src/
│   │   │   ├── lib/           # 共享库
│   │   │   │   ├── api/       # 生成的 API 客户端
│   │   │   │   ├── components/# UI 组件
│   │   │   │   ├── stores/    # Svelte 状态管理
│   │   │   │   └── hooks/     # 自定义 Hooks
│   │   │   └── routes/        # 页面路由
│   │   └── static/            # 静态资源
│   │
│   ├── server/                # Elysia 后端服务
│   │   └── src/
│   │       ├── config/        # 配置
│   │       ├── routers/       # 自定义路由
│   │       └── server/        # 服务核心
│   │           └── plugins/   # Elysia 插件
│   │
│   └── docs/                  # VuePress 文档站点
│
├── packages/
│   ├── db/                    # 数据库实体和连接
│   │   ├── src/entities/      # Drizzle 实体定义
│   │   │   ├── system/        # 系统管理实体
│   │   │   ├── ai/            # AI 模块实体
│   │   │   ├── im/            # 即时通讯实体
│   │   │   └── knowledge/     # 知识库实体
│   │   └── drizzle/           # 数据库迁移
│   │
│   ├── actions/               # 业务逻辑 Actions
│   │   └── src/
│   │       ├── core/          # Action 核心定义
│   │       ├── db/            # 数据库 CRUD Actions
│   │       ├── files/         # 文件操作 Actions
│   │       └── filter/        # 查询过滤器
│   │
│   ├── i18n/                  # 国际化翻译
│   │   └── src/locales/       # 语言包 (zh-CN, en)
│   │
│   ├── actions-flow-editor/   # AI 工作流可视化编辑器
│   ├── zod-visual-editor/     # Zod Schema 可视化编辑器
│   ├── file-icons/            # 文件图标组件
│   └── vite-plugin-*/         # Vite 插件
│
├── turbo.json                 # Turborepo 配置
└── package.json               # 根 package.json
```

---

## 📦 模块说明

### @qiyu-allinai/db

数据库层，使用 Drizzle ORM 定义实体和关系。

```typescript
// 导入实体
import { user, userZodSchemas } from '@qiyu-allinai/db/entities/system';

// 使用 Zod Schema 进行验证
const userData = userZodSchemas.insert.parse(input);
```

### @qiyu-allinai/actions

业务逻辑层，使用 `defineAction` 创建标准化的 API 操作。

```typescript
import { defineAction } from '@qiyu-allinai/actions/core';

export const myAction = defineAction({
  meta: {
    name: 'module.entity.action',
    method: 'POST',
    path: '/api/module/entity/action'
  },
  schemas: {
    bodySchema: z.object({ ... }),
    outputSchema: z.object({ ... }),
  },
  execute: async (input, context) => {
    // 业务逻辑
  },
});
```

### @qiyu-allinai/i18n

国际化支持，提供中英文翻译。

```typescript
import { t } from '@qiyu-allinai/i18n';

const message = t('error.system.admin.cannot.modify');
```

### @qiyu-allinai/actions-flow-editor

AI 工作流可视化编辑器，基于 @xyflow/svelte 构建。



---

## 🔧 开发命令

```bash
# 启动所有服务（前端 + 后端）
bun run dev

# 仅启动前端
bun run --filter=frontend dev

# 仅启动后端
bun run --filter=@qiyu-allinai/server dev

# 构建所有项目
bun run build

# 类型检查
bun run check-types

# 数据库迁移
bun run --filter=@qiyu-allinai/db generate  # 生成迁移
bun run --filter=@qiyu-allinai/db migrate   # 执行迁移
bun run --filter=@qiyu-allinai/db seed      # 初始化数据

# 生成 API 客户端
bun run --filter=frontend generate:api

```

---

## 🔌 二次开发

### 添加新实体

1. 在 `packages/db/src/entities/` 下创建实体文件
2. 在 `packages/actions/src/db/` 下创建对应的 Actions
3. 在 `packages/i18n/src/locales/` 下添加翻译
4. 运行 `bun run --filter=@qiyu-allinai/db generate` 生成迁移

### 添加新页面

1. 在 `apps/frontend/src/routes/dashboard/` 下创建路由
2. 导出 `_meta` 对象配置页面元数据
3. 页面会自动注册到导航菜单

```typescript
// +page.ts
export const _meta = {
  title: '页面标题',
  icon: 'tdesign:icon-name',
  group: '分组名称',
  order: 10,
  permission: 'module:entity:view'
};
```

### 添加新 AI 工具

1. 在 AI 工具管理页面创建工具组
2. 添加工具定义（名称、描述、输入/输出 Schema）
3. 使用 Actions Flow Editor 编排工具执行流程

### 集成新的 AI 提供商

1. 在 AI 模型管理页面添加提供商配置
2. 配置 API Key 和端点
3. 添加该提供商支持的模型

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

### 代码规范

- 使用 TypeScript，避免 `any` 类型
- 遵循 Svelte 5 的 `$state`、`$derived`、`$effect` 模式
- 使用 Zod 进行数据验证
- 保持中英文翻译同步

---

## 📄 许可证

[MIT License](LICENSE)

---

## 🙏 致谢

本项目基于以下优秀的开源项目构建：

- [Bun](https://bun.sh) - 高性能 JavaScript 运行时
- [SvelteKit](https://kit.svelte.dev) - 现代化 Web 框架
- [Elysia](https://elysiajs.com) - 高性能 TypeScript 后端框架
- [shadcn-svelte](https://shadcn-svelte.com) - 精美的 UI 组件库
- [Drizzle ORM](https://orm.drizzle.team) - 类型安全的 ORM
- [@xyflow/svelte](https://svelteflow.dev) - 流程图编辑器

---

<p align="center">
  Made with ❤️ by Qiyu Zhou
</p>
