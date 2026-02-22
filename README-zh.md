<p align="center">
  <img src="apps/frontend/src/lib/assets/logo.png" alt="Qiyu AllInAI Logo" width="120" />
  <h1 align="center">Qiyu AllInAI</h1>
  <p align="center">
    <strong>企业级 AI 应用基座系统</strong>
  </p>
  <p align="center">
    <a href="#功能特性">功能特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#开发指南">开发指南</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Bun-1.3.6+-black?logo=bun" alt="Bun" />
    <img src="https://img.shields.io/badge/Svelte-5-orange?logo=svelte" alt="Svelte 5" />
    <img src="https://img.shields.io/badge/Elysia-1.4+-purple" alt="Elysia" />
    <img src="https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
  <p align="center">
    <a href="README.md">English</a>
  </p>
</p>

---

## 💡 项目简介

Qiyu AllInAI 是一个**开箱即用的 AI 应用基座系统**，采用现代化技术栈构建，为企业级 AI 应用开发提供完整的基础设施。

### 设计理念

- **Bun 优先** - 超快的 JavaScript 运行时（比 Node.js 快 4 倍）
- **类型安全** - 端到端 TypeScript + Zod 验证
- **模块化** - Turborepo Monorepo 架构，包可复用
- **AI 原生** - 内置 AI Agent、工具编排、模型管理

---

## ✨ 功能特性

### 🔐 系统管理
- 用户、角色、部门、岗位管理
- 基于菜单的权限控制（Casbin RBAC）
- 字典和系统配置
- 操作日志和登录审计

### 🤖 AI 模块
- 多供应商模型管理（OpenAI、Anthropic、Azure 等）
- AI Agent 创建和会话管理
- 工具定义和分组
- MCP（模型上下文协议）服务器集成

### 💬 即时通讯
- 私聊和群聊（WebSocket）
- 多种消息类型（文本、图片、文件）
- 已读状态追踪

### 📁 知识库
- 文件和文件夹树形管理
- 版本控制和回滚
- 细粒度权限控制
- 在线 Markdown 编辑

### 🎨 界面体验
- 深色/浅色主题切换
- 响应式设计
- 国际化（中文/英文）
- shadcn-svelte 组件库

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| **运行时** | [Bun](https://bun.sh) 1.3.6+ |
| **Monorepo** | [Turborepo](https://turbo.build) |
| **前端** | [SvelteKit](https://kit.svelte.dev) + Svelte 5 |
| **UI** | [shadcn-svelte](https://shadcn-svelte.com) + Tailwind CSS v4 |
| **后端** | [Elysia](https://elysiajs.com) |
| **数据库** | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| **验证** | [Zod](https://zod.dev) v4 |
| **存储** | MinIO / S3 兼容 |
| **国际化** | [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) |

---

## 🚀 快速开始

### 环境要求

- [Bun](https://bun.sh) >= 1.3.6
- [PostgreSQL](https://postgresql.org) >= 14
- [MinIO](https://min.io)（可选，用于文件存储）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/AI-NoDev/All-In-AI.Base.git
cd All-In-AI.Base

# 安装依赖
bun install

# 配置环境变量
cp packages/db/.env.example packages/db/.env
cp apps/server/.env.example apps/server/.env
cp apps/frontend/.env.example apps/frontend/.env

# 初始化数据库
bun run db:push    # 推送表结构
bun run db:reset   # 初始化种子数据

# 启动开发服务
bun run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端 API | http://localhost:3030 |
| API 文档 (Swagger) | http://localhost:3030/swagger |

### 默认账号

- **用户名**: `admin`
- **密码**: `admin123`

---

## 📁 项目结构

```
qiyu-allinai/
├── apps/
│   ├── frontend/              # SvelteKit 前端
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── api/       # 生成的 API 客户端
│   │   │   │   ├── components/# UI 组件
│   │   │   │   └── stores/    # Svelte 状态管理
│   │   │   └── routes/        # 页面路由
│   │   └── static/
│   │
│   └── server/                # Elysia 后端
│       └── src/
│           ├── routers/       # 自定义路由
│           └── server/
│               ├── app.ts     # 主应用（Action 注册）
│               └── plugins/   # Elysia 插件
│
├── packages/
│   ├── db/                    # 数据库层
│   │   ├── src/
│   │   │   ├── entities/      # Drizzle 实体
│   │   │   │   ├── system/    # 用户、角色、菜单等
│   │   │   │   ├── ai/        # Agent、模型、供应商
│   │   │   │   ├── im/        # 会话、消息
│   │   │   │   └── knowledge/ # 节点、版本、权限
│   │   │   ├── seedData/      # 种子数据
│   │   │   └── casbin/        # RBAC 权限适配器
│   │   └── drizzle/           # 迁移文件
│   │
│   ├── actions/               # 业务逻辑层
│   │   └── src/
│   │       ├── core/          # defineAction、类型定义
│   │       ├── db/            # CRUD Actions
│   │       └── files/         # 文件操作
│   │
│   ├── i18n/                  # 国际化
│   │   ├── messages/          # 翻译 JSON 文件
│   │   └── paraglide/         # 生成的运行时
│   │
│   ├── storage/               # S3/MinIO 客户端
│   ├── cache/                 # Redis 缓存
│   └── api/                   # 生成的 API 类型
│
├── turbo.json                 # Turborepo 配置
└── package.json               # 根 package.json
```

---

## 🔧 开发指南

### 常用命令

```bash
# 开发
bun run dev                    # 启动所有服务
bun run dev:frontend           # 仅前端
bun run dev:server             # 仅后端

# 数据库
bun run db:generate            # 生成迁移文件
bun run db:push                # 推送表结构（无迁移）
bun run db:migrate             # 执行迁移
bun run db:seed                # 填充数据
bun run db:reset               # 重置种子数据

# 构建
bun run build                  # 构建所有
bun run build:frontend         # 构建前端
bun run build:server           # 构建后端二进制
```

### 添加新实体

1. 在 `packages/db/src/entities/{module}/` 创建实体文件
2. 从 `packages/db/src/entities/{module}/index.ts` 导出
3. 在 `packages/actions/src/db/{module}/` 创建 Actions
4. 从 `packages/actions/src/db/index.ts` 导出
5. 运行 `bun run db:push` 更新表结构

### 添加新页面

1. 在 `apps/frontend/src/routes/dashboard/{path}/` 创建路由
2. 导出 `_meta` 配置导航：

```typescript
// +page.ts
export const _meta = {
  title: '页面标题',
  icon: 'mdi:icon-name',
  group: '分组名称',
  order: 10,
  permission: 'module:entity:view'
};
```

---

## 📖 开发文档

详细开发文档请访问运行中应用的 `/docs` 路径，或查看：

- [快速开始](/docs/zh-CN/guide/getting-started/)
- [项目结构](/docs/zh-CN/guide/project-structure/)
- [Action 开发](/docs/zh-CN/backend/actions/)
- [组件开发](/docs/zh-CN/frontend/components/)

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing`)
5. 提交 Pull Request

### 代码规范

- TypeScript 严格模式，避免 `any`
- Svelte 5 runes（`$state`、`$derived`、`$effect`）
- 所有数据验证使用 Zod
- 保持中英文翻译同步

---

## 📄 开源协议

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by Qiyu Zhou
</p>
