---
inclusion: always
---

# 项目技术栈规范

这是一个 Turborepo monorepo 项目，使用 Bun 作为运行时和包管理器。

## 项目结构

```
ai-drive-system/
├── apps/
│   ├── frontend/    # Svelte + Vite 前端
│   └── server/      # Elysia 后端
├── packages/        # 共享包
├── turbo.json       # Turborepo 配置
└── package.json     # 根 package.json (workspaces)
```

## Bun 优先

- 使用 `bun <file>` 而不是 `node <file>` 或 `ts-node <file>`
- 使用 `bun test` 而不是 `jest` 或 `vitest`
- 使用 `bun install` 而不是 `npm install` / `yarn install` / `pnpm install`
- 使用 `bun run <script>` 而不是 `npm run` / `yarn run` / `pnpm run`
- 使用 `bunx <package>` 而不是 `npx <package>`
- Bun 自动加载 `.env`，不需要 dotenv

## Turborepo 命令

```sh
# 开发模式（同时启动所有 apps）
bun run dev

# 构建所有项目
bun run build

# 类型检查
bun run check-types

# 单独运行某个 app
bun run --filter=server dev
bun run --filter=frontend dev
```

## 后端 (apps/server) - Elysia

使用 Elysia 框架，不要使用 Express 或 Bun.serve()。

```ts
import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/api/users/:id", ({ params }) => ({ id: params.id }))
  .post("/api/users", ({ body }) => body)
  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
```

### Elysia 插件

```ts
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", () => "Hello");
```

### WebSocket (Elysia)

```ts
import { Elysia } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    open(ws) {
      ws.send("Connected");
    },
    message(ws, message) {
      ws.send(message);
    },
    close(ws) {
      console.log("Disconnected");
    },
  })
  .listen(3000);
```

## 前端 (apps/frontend) - Svelte + Vite

使用 Svelte 5 + Vite 进行前端开发。

### Svelte 5 组件

```svelte
<script lang="ts">
  let count = $state(0);
  
  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>
```

### Vite 开发

```sh
# 在 apps/frontend 目录
bun run dev      # 开发服务器
bun run build    # 生产构建
bun run preview  # 预览构建结果
bun run check    # Svelte 类型检查
```

## Bun 内置 API

- `Bun.file()` 读写文件，优于 `node:fs`
- `Bun.$\`command\`` 执行 shell 命令，优于 execa
- `bun:sqlite` 用于 SQLite
- `Bun.redis` 用于 Redis
- `Bun.sql` 用于 Postgres

## 测试

```ts
import { test, expect } from "bun:test";

test("example", () => {
  expect(1 + 1).toBe(2);
});
```

运行测试：

```sh
bun test
```

## 共享包 (packages/)

在 `packages/` 目录创建共享代码：

```sh
# 创建新包
mkdir packages/shared
cd packages/shared
bun init
```

在其他 app 中引用：

```json
{
  "dependencies": {
    "shared": "workspace:*"
  }
}
```
