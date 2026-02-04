import { app } from "./server";

const port = Bun.env.PORT || 3000;

app.listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// 导出 app 和类型供外部使用
export { app, type App } from "./server";
