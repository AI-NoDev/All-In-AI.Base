# 快速开始

本指南帮助你快速搭建开发环境并运行项目。

## 环境要求

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Bun | >= 1.3.6 | 运行时和包管理器 |
| PostgreSQL | >= 15 | 数据库 |
| Node.js | >= 20 | 可选，部分工具需要 |

## 安装 Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

## 克隆项目

```bash
git clone <repository-url>
cd ai-drive-system
```

## 安装依赖

```bash
bun install
```

## 配置环境变量

复制环境变量模板：

```bash
# 后端配置
cp apps/server/.env.example apps/server/.env

# 前端配置
cp apps/frontend/.env.example apps/frontend/.env
```

编辑 `apps/server/.env`，配置数据库连接：

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/allinai
JWT_SECRET=your-secret-key
```

## 初始化数据库

```bash
# 进入数据库包目录
cd packages/db

# 推送 Schema 到数据库（开发环境）
bun run db:push

# 初始化种子数据
bun run db:seed

# 返回项目根目录
cd ../..
```

## 启动开发服务器

```bash
# 同时启动前端和后端
bun run dev
```

启动后访问：
- 前端：http://localhost:5173
- 后端 API：http://localhost:3000
- API 文档：http://localhost:3000/swagger

## 默认账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | admin123 | 系统管理员 |

## 常用命令

```bash
# 开发模式（所有服务）
bun run dev

# 单独启动前端
bun run --filter=frontend dev

# 单独启动后端
bun run --filter=server dev

# 构建所有项目
bun run build

# 类型检查
bun run check-types

# 代码格式化
bun run format
```

## 数据库命令

```bash
cd packages/db

# 生成迁移文件
bun run db:generate

# 推送 Schema（开发环境，会丢失数据）
bun run db:push

# 执行迁移（生产环境）
bun run db:migrate

# 初始化种子数据
bun run db:seed

# 打开 Drizzle Studio
bun run db:studio
```

## 下一步

- [项目结构](/docs/zh-CN/guide/project-structure) - 了解项目目录结构
- [实体开发](/docs/zh-CN/backend/entities) - 学习如何定义数据库实体
- [Action 开发](/docs/zh-CN/backend/actions) - 学习如何创建 API 接口
