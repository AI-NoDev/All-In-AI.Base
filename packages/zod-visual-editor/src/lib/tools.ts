/**
 * ZodVisualEditor AI Tools 定义
 * 
 * 用于 AI Agent 操作 Schema 编辑器的工具定义
 */

import { z } from 'zod';
import type { ZodVisualEditorRef, SchemaType, SchemaItem, RootSchema } from './types.js';

/** Schema 类型枚举 */
const schemaTypeEnum = z.enum(['string', 'number', 'boolean', 'datetime', 'literal', 'object', 'union']);

/** SchemaItem 的 Zod Schema */
const schemaItemSchema: z.ZodType<SchemaItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: schemaTypeEnum,
    required: z.boolean(),
    isArray: z.boolean(),
    description: z.string().optional(),
    default: z.unknown().optional(),
    fields: z.array(schemaItemSchema).optional(),
    options: z.array(schemaItemSchema).optional(),
    lazy: z.object({ refId: z.string() }).optional(),
    literalValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })
);

/** ZodSchemaEditor 客户端工具定义（不含 execute，用于后端 streamText） */
export const zodSchemaEditorTools = {
  getSchema: {
    description: '获取当前编辑器中的完整 Schema 结构',
    inputSchema: z.object({}),
  },
  setSchema: {
    description: '设置整个 Schema（会覆盖现有内容）',
    inputSchema: z.object({
      fields: z.array(schemaItemSchema).describe('根级字段列表'),
    }),
  },
  addField: {
    description: '向指定父级添加新字段。parentId 为 "root" 表示添加到根级别，或者指定 object/union 类型字段的 ID',
    inputSchema: z.object({
      parentId: z.string().describe('父级 ID，"root" 表示根级别'),
      type: schemaTypeEnum.describe('字段类型'),
      name: z.string().optional().describe('字段名称（可选，默认自动生成）'),
    }),
  },
  removeField: {
    description: '根据 ID 删除字段',
    inputSchema: z.object({
      fieldId: z.string().describe('要删除的字段 ID'),
    }),
  },
  getField: {
    description: '根据 ID 获取字段详情',
    inputSchema: z.object({
      fieldId: z.string().describe('字段 ID'),
    }),
  },
  updateField: {
    description: '更新指定字段的属性',
    inputSchema: z.object({
      fieldId: z.string().describe('字段 ID'),
      updates: z.object({
        name: z.string().optional().describe('字段名称'),
        required: z.boolean().optional().describe('是否必填'),
        isArray: z.boolean().optional().describe('是否为数组'),
        description: z.string().optional().describe('字段描述'),
        literalValue: z.union([z.string(), z.number(), z.boolean()]).optional().describe('字面量值（仅 literal 类型）'),
      }).describe('要更新的属性'),
    }),
  },
  duplicateField: {
    description: '复制指定字段（包括其子字段）',
    inputSchema: z.object({
      fieldId: z.string().describe('要复制的字段 ID'),
    }),
  },
  getRootFields: {
    description: '获取所有根级字段',
    inputSchema: z.object({}),
  },
  clearAllFields: {
    description: '清空编辑器中的所有字段',
    inputSchema: z.object({}),
  },
  getGeneratedCode: {
    description: '获取当前 Schema 生成的 TypeScript/Zod 代码',
    inputSchema: z.object({}),
  },
  toggleCodeView: {
    description: '切换代码预览的显示/隐藏状态',
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
 * @param editorRef - 编辑器 ref
 * @param toolName - 工具名称
 * @param input - 工具输入参数
 * @returns 工具执行结果
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
      const fields = input.fields as SchemaItem[];
      const newSchema: RootSchema = { type: 'object', id: 'root', fields };
      editorRef.setSchema(newSchema);
      return { success: true };
    }
    case 'addField': {
      const { parentId, type, name } = input as { parentId: string; type: SchemaType; name?: string };
      const field = editorRef.addFieldTo(parentId, type, name);
      if (field) {
        return { success: true, field };
      }
      return { success: false, error: '添加失败，父级不存在或类型不支持' };
    }
    case 'removeField': {
      const { fieldId } = input as { fieldId: string };
      const success = editorRef.removeField(fieldId);
      return { success, error: success ? undefined : '删除失败，字段不存在' };
    }
    case 'getField': {
      const { fieldId } = input as { fieldId: string };
      const field = editorRef.getFieldById(fieldId);
      if (field) {
        return { success: true, field };
      }
      return { success: false, error: '字段不存在' };
    }
    case 'updateField': {
      const { fieldId, updates } = input as { fieldId: string; updates: Partial<SchemaItem> };
      const success = editorRef.updateFieldById(fieldId, updates);
      return { success, error: success ? undefined : '更新失败，字段不存在' };
    }
    case 'duplicateField': {
      const { fieldId } = input as { fieldId: string };
      const field = editorRef.duplicateFieldById(fieldId);
      if (field) {
        return { success: true, field };
      }
      return { success: false, error: '复制失败，字段不存在' };
    }
    case 'getRootFields': {
      const fields = editorRef.getRootFields();
      return { success: true, fields };
    }
    case 'clearAllFields': {
      editorRef.clearAllFields();
      return { success: true };
    }
    case 'getGeneratedCode': {
      const code = editorRef.getGeneratedCode();
      return { success: true, code };
    }
    case 'toggleCodeView': {
      editorRef.toggleCodeView();
      const visible = editorRef.isCodeViewVisible();
      return { success: true, visible };
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
 * @returns 转换后的 tools 对象
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
