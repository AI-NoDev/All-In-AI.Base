/**
 * ZodVisualEditor AI Tools 定义
 * 
 * 用于 AI Agent 操作 Schema 编辑器的工具定义
 */

import { z } from 'zod';
import type { FieldType, Field, RootSchema, SchemaType } from './types.js';

/** 编辑器 Ref 接口 */
export interface ZodVisualEditorRef {
  getSchema(): RootSchema;
  setSchema(schema: RootSchema): void;
  getGeneratedCode(): string;
  getJsonSchema(): Record<string, unknown>;
}

/** 字段类型枚举 */
const fieldTypeEnum = z.enum(['string', 'number', 'boolean', 'literal', 'enum', 'array', 'union', 'object']);

/** SchemaType Schema（递归，无 name） */
const schemaTypeSchema: z.ZodType<SchemaType> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({ id: z.string(), type: z.literal('string'), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('number'), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('boolean'), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('literal'), value: z.union([z.string(), z.number(), z.boolean()]), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('enum'), values: z.array(z.union([z.string(), z.number()])), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('array'), item: schemaTypeSchema, description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('union'), options: z.array(schemaTypeSchema), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
    z.object({ id: z.string(), type: z.literal('object'), fields: z.array(z.lazy(() => fieldSchema)), description: z.string().optional(), optional: z.boolean().optional(), nullable: z.boolean().optional() }),
  ])
);

/** Field Schema（有 name） */
const fieldSchema: z.ZodType<Field> = schemaTypeSchema.and(z.object({ name: z.string() })) as z.ZodType<Field>;

/** ZodSchemaEditor 客户端工具定义 */
export const zodSchemaEditorTools = {
  getSchema: {
    description: '获取当前编辑器中的完整 Schema 结构',
    inputSchema: z.object({}),
  },
  setSchema: {
    description: '设置整个 Schema（会覆盖现有内容）',
    inputSchema: z.object({
      fields: z.array(fieldSchema).describe('根级字段列表'),
    }),
  },
  getGeneratedCode: {
    description: '获取当前 Schema 生成的 TypeScript/Zod 代码',
    inputSchema: z.object({}),
  },
  getJsonSchema: {
    description: '获取当前 Schema 生成的 JSON Schema',
    inputSchema: z.object({}),
  },
} as const;

/** 工具名称类型 */
export type ZodSchemaEditorToolName = keyof typeof zodSchemaEditorTools;

/** Tool 调用结果 */
export interface ToolCallResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

/**
 * 执行 ZodSchemaEditor 工具调用
 */
export function callTool(
  editorRef: ZodVisualEditorRef,
  toolName: ZodSchemaEditorToolName,
  input: Record<string, unknown>
): ToolCallResult {
  switch (toolName) {
    case 'getSchema': {
      const schema = editorRef.getSchema();
      return { success: true, schema };
    }
    case 'setSchema': {
      const { fields } = input as { fields: Field[] };
      const newSchema: RootSchema = { type: 'object', id: 'root', fields };
      editorRef.setSchema(newSchema);
      return { success: true };
    }
    case 'getGeneratedCode': {
      const code = editorRef.getGeneratedCode();
      return { success: true, code };
    }
    case 'getJsonSchema': {
      const jsonSchema = editorRef.getJsonSchema();
      return { success: true, jsonSchema };
    }
    default:
      return { success: false, error: `未知工具: ${toolName}` };
  }
}

/** 后端 API 需要的 Tool 定义格式 */
export interface ApiToolDefinition {
  description: string;
  parameters: Record<string, unknown>;
}

/**
 * 将 zodSchemaEditorTools 转换为后端 API 需要的格式
 */
export function getToolsForApi(): Record<string, ApiToolDefinition> {
  const result: Record<string, ApiToolDefinition> = {};

  for (const [name, def] of Object.entries(zodSchemaEditorTools)) {
    result[name] = {
      description: def.description,
      parameters: z.toJSONSchema(def.inputSchema),
    };
  }

  return result;
}
