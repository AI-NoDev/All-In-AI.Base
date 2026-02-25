/**
 * Actions Plugin - LLMs.txt 生成
 * 为 AI 系统提供结构化的 API 文档
 */

import { Elysia } from "elysia";
import type { ActionDefinition } from "@qiyu-allinai/actions";

/**
 * 生成单个 action 的 llms.txt 内容
 */
export function generateLlmsTxt(action: ActionDefinition): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`# ${action.meta.displayName}`);
  lines.push("");
  lines.push(`> ${action.meta.description}`);
  lines.push("");
  
  // API Info
  lines.push("## API Endpoint");
  lines.push("");
  lines.push(`- **Method**: ${action.meta.method}`);
  lines.push(`- **Path**: ${action.meta.path}`);
  if (action.meta.tags?.length) {
    lines.push(`- **Tags**: ${action.meta.tags.join(", ")}`);
  }
  lines.push("");
  
  // Input Schema
  const hasInput = action.schemas.paramsSchema || action.schemas.querySchema || action.schemas.bodySchema;
  if (hasInput) {
    lines.push("## Input Schema");
    lines.push("");
    
    if (action.schemas.paramsSchema) {
      lines.push("### Path Parameters");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(action.schemas.paramsSchema, null, 2));
      lines.push("```");
      lines.push("");
    }
    
    if (action.schemas.querySchema) {
      lines.push("### Query Parameters");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(action.schemas.querySchema, null, 2));
      lines.push("```");
      lines.push("");
    }
    
    if (action.schemas.bodySchema) {
      lines.push("### Request Body");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(action.schemas.bodySchema, null, 2));
      lines.push("```");
      lines.push("");
    }
  }
  
  // Output Schema
  if (action.schemas.outputSchema) {
    lines.push("## Output Schema");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(action.schemas.outputSchema, null, 2));
    lines.push("```");
    lines.push("");
  }
  
  // Usage Example
  lines.push("## Usage");
  lines.push("");
  lines.push("This endpoint requires Bearer token authentication.");
  lines.push("");
  lines.push("```bash");
  if (action.meta.method === "GET" || action.meta.method === "DELETE") {
    lines.push(`curl -X ${action.meta.method} "${action.meta.path}" \\`);
    lines.push(`  -H "Authorization: Bearer <token>"`);
  } else {
    lines.push(`curl -X ${action.meta.method} "${action.meta.path}" \\`);
    lines.push(`  -H "Authorization: Bearer <token>" \\`);
    lines.push(`  -H "Content-Type: application/json" \\`);
    lines.push(`  -d '{}'`);
  }
  lines.push("```");
  
  return lines.join("\n");
}

/**
 * 生成所有 actions 的汇总 llms.txt
 */
export function generateAllActionsLlmsTxt(actions: ActionDefinition[]): string {
  const lines: string[] = [];
  
  lines.push("# API Documentation");
  lines.push("");
  lines.push("> AI-friendly API documentation for all available endpoints");
  lines.push("");
  
  // Group by tags
  const tagGroups = new Map<string, ActionDefinition[]>();
  for (const action of actions) {
    if (action.meta.ignoreTools) continue;
    if (action.meta.path.endsWith('/schema')) continue;
    
    const tag = action.meta.tags?.[0] || "other";
    if (!tagGroups.has(tag)) {
      tagGroups.set(tag, []);
    }
    tagGroups.get(tag)!.push(action);
  }
  
  // Generate index
  lines.push("## Endpoints");
  lines.push("");
  
  for (const [tag, tagActions] of tagGroups) {
    lines.push(`### ${tag}`);
    lines.push("");
    for (const action of tagActions) {
      lines.push(`- [${action.meta.displayName}](${action.meta.path}/llms.txt): ${action.meta.description}`);
    }
    lines.push("");
  }
  
  return lines.join("\n");
}

/**
 * 创建 llms.txt 路由
 */
export function createLlmsRoutes(allActions: ActionDefinition[]): Elysia {
  const app = new Elysia({ name: "actions-llms-routes" });
  const actionsMap = new Map(allActions.map(a => [a.meta.name, a]));

  // 全局 llms.txt - 所有 API 汇总
  app.get(
    "/api/llms.txt",
    ({ set }) => {
      set.headers["Content-Type"] = "text/plain; charset=utf-8";
      return generateAllActionsLlmsTxt(allActions);
    },
    {
      detail: {
        summary: "API LLMs.txt",
        description: "AI-friendly documentation index for all API endpoints",
        tags: ["llms"],
      },
    }
  );

  // 每个 action 的 llms.txt
  for (const action of allActions) {
    app.get(
      `${action.meta.path}/llms.txt`,
      ({ set }) => {
        set.headers["Content-Type"] = "text/plain; charset=utf-8";
        return generateLlmsTxt(action);
      },
      {
        detail: {
          summary: `${action.meta.displayName} - LLMs.txt`,
          description: "AI-friendly documentation for this API endpoint",
          tags: ["llms"],
        },
      }
    );
  }

  return app;
}
