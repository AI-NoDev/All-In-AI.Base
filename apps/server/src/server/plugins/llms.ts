import { llms } from "@opuu/elysia-llms-txt";
import { Elysia } from "elysia";

export const llmsPlugin = new Elysia({ name: "plugin/llms" })
  .use(llms({
    source: {
      type: "url",
      url: "/openapi/json",
    },
    header: `# AI Drive System

智能驱动系统 API 文档

## 功能
- 系统管理
- AI 智能体
- 知识库管理
`,
    cache: {
      enabled: true,
      ttl: 60000,
    },
  }));
