import { createApp } from "./server";

const port = Bun.env.PORT || 3000;
const app = await createApp()
app.listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


