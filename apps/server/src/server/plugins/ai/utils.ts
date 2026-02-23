/**
 * AI Plugin 工具函数
 */

import { tool, jsonSchema, type UIMessage, type ToolSet } from '@qiyu-allinai/ai';
import { t } from 'elysia';
import type { TSchema, TObject, TProperties } from '@sinclair/typebox';
import { model, provider, agent, tool as toolTable } from '@qiyu-allinai/db';
import db from '@qiyu-allinai/db/connect';
import { eq, inArray } from 'drizzle-orm';
import { dbActions, filesActions, type ActionDefinition, type ActionContext } from '@qiyu-allinai/actions';
import { FlowExecutor } from './flow-executor';
import type {
  InputMessage,
  ClientToolDefinition,
  ModelConfig,
  AgentConfig,
  WorkflowDefinition,
  GetActionByName,
  FlowActionContext,
} from './types';

/** 所有可用的 Actions */
const allActions = [...dbActions, ...filesActions];

const emptyJsonSchema = jsonSchema<Record<string, never>>({
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false,
});

/** 
 * 规范化消息：确保 content 和 parts 字段存在
 * 将 file 类型转换为 AI SDK 期望的格式：
 * - image/* -> { type: 'image', image: url }
 * - audio/*, video/*, application/* -> { type: 'file', data: url, mimeType }
 * 
 * AI SDK 的 UIMessage 使用 content 数组（用于 convertToModelMessages）
 */
export function normalizeMessages(messages: InputMessage[]): UIMessage[] {
  return messages.map(msg => {
    // 提取 text 和 file 类型的 parts（过滤掉 reasoning 等其他类型）
    const validParts = msg.parts?.filter(p => p.type === 'text' || p.type === 'file') || [];
    const textParts = validParts.filter(p => p.type === 'text');
    const textContent = msg.content || textParts.map(p => p.text || '').join('');
    
    // 转换 parts 为 AI SDK content 格式
    const contentParts = validParts.length > 0 
      ? validParts.map(p => {
          if (p.type === 'file' && p.url && p.mediaType) {
            // 图片类型：转换为 { type: 'image', image: url }
            if (p.mediaType.startsWith('image/')) {
              return { type: 'image', image: p.url };
            }
            // 其他文件类型（音频、视频、PDF等）：转换为 { type: 'file', data: url, mimeType }
            return { type: 'file', data: p.url, mimeType: p.mediaType };
          }
          return p;
        })
      : [{ type: 'text', text: textContent }];
    
    return {
      id: msg.id,
      role: msg.role,
      content: contentParts,  // AI SDK 使用 content 数组
      parts: contentParts,    // 保留 parts 用于 UI 显示
    } as unknown as UIMessage;
  });
}

/** 转换客户端工具为 ToolSet */
export function convertClientTools(clientTools?: Record<string, ClientToolDefinition>): ToolSet {
  if (!clientTools) return {};

  const tools: ToolSet = {};
  for (const [name, def] of Object.entries(clientTools)) {
    tools[name] = tool({
      description: def.description,
      inputSchema: emptyJsonSchema,
    });
  }
  return tools;
}

/** 获取模型配置 */
export async function getModelConfig(modelId: string): Promise<ModelConfig> {
  const [modelRecord] = await db
    .select()
    .from(model)
    .where(eq(model.id, modelId))
    .limit(1);

  if (!modelRecord) throw new Error('error.ai.model.notFound');
  if (modelRecord.status !== '0') throw new Error('error.ai.model.disabled');

  const [providerRecord] = await db
    .select()
    .from(provider)
    .where(eq(provider.id, modelRecord.providerId))
    .limit(1);

  if (!providerRecord) throw new Error('error.ai.provider.notFound');
  if (providerRecord.status !== '0') throw new Error('error.ai.provider.disabled');

  return { 
    model: {
      ...modelRecord,
      status: modelRecord.status || '0',
    }, 
    provider: {
      ...providerRecord,
      status: providerRecord.status || '0',
    },
  };
}

/** 构建 Actions Map */
function buildActionsMap() {
  const actionsMap = new Map<string, ActionDefinition>();
  for (const action of allActions) {
    actionsMap.set(action.meta.name, action);
  }
  return actionsMap;
}

/** 合并 Action Schemas - 使用 TypeBox */
function mergeActionSchemas(action: ActionDefinition): TObject {
  const properties: TProperties = {};
  
  if (action.schemas.querySchema) {
    properties.query = action.schemas.querySchema;
  }
  if (action.schemas.paramsSchema) {
    properties.params = action.schemas.paramsSchema;
  }
  if (action.schemas.bodySchema) {
    properties.body = action.schemas.bodySchema;
  }
  
  return t.Object(properties);
}

/** 将 Action 转换为 AI Tool */
function actionToAITool(action: ActionDefinition, context: ActionContext) {
  const inputSchema = mergeActionSchemas(action);
  
  return tool({
    description: action.meta.description,
    inputSchema: jsonSchema(inputSchema),
    execute: async (input) => {
      return action.execute(input, context);
    },
  });
}

/** 获取 Agent 配置 */
export async function getAgentConfig(agentId: string, actionContext: ActionContext): Promise<AgentConfig> {
  const [agentRecord] = await db
    .select()
    .from(agent)
    .where(eq(agent.id, agentId))
    .limit(1);

  if (!agentRecord) throw new Error('error.ai.agent.notFound');
  if (agentRecord.status !== '0') throw new Error('error.ai.agent.disabled');

  const modelConfig = await getModelConfig(agentRecord.modelId);
  const agentTools: ToolSet = {};
  const actionsMap = buildActionsMap();

  const nativeTools = agentRecord.nativeTools as string[] | null;
  if (nativeTools && nativeTools.length > 0) {
    for (const actionName of nativeTools) {
      const action = actionsMap.get(actionName);
      if (!action) continue;
      agentTools[actionName] = actionToAITool(action, actionContext);
    }
  }

  const toolIds = agentRecord.toolIds as string[] | null;
  if (toolIds && toolIds.length > 0) {
    const toolRecords = await db
      .select()
      .from(toolTable)
      .where(inArray(toolTable.id, toolIds));

    const getActionByName: GetActionByName = (name: string) => {
      const action = actionsMap.get(name);
      if (!action) return undefined;
      return {
        name: action.meta.name,
        execute: async (input: Record<string, unknown>, ctx: FlowActionContext) => {
          return action.execute(input, ctx as ActionContext);
        },
      };
    };

    for (const toolRecord of toolRecords) {
      if (toolRecord.status !== '0') continue;

      const dbInputSchema = toolRecord.inputSchema as Record<string, unknown> | null;
      const toolInputSchema = dbInputSchema 
        ? jsonSchema<Record<string, unknown>>(dbInputSchema)
        : emptyJsonSchema;

      agentTools[toolRecord.name] = tool({
        description: toolRecord.description ?? '',
        inputSchema: toolInputSchema,
        execute: async (args: Record<string, unknown>) => {
          if (!toolRecord.implementation) {
            throw new Error(`Tool ${toolRecord.name} has no implementation`);
          }

          const workflow = JSON.parse(toolRecord.implementation) as WorkflowDefinition;
          const executor = new FlowExecutor(workflow, {
            getActionByName,
            context: {
              currentUserId: actionContext.currentUserId,
              currentUserName: actionContext.currentUserName,
              token: actionContext.token,
            },
          });
          
          const result = await executor.execute(args);
          if (!result.success) throw new Error(result.error || 'Flow execution failed');
          return result.output;
        },
      });
    }
  }

  return {
    agent: agentRecord,
    model: {
      id: modelConfig.model.id,
      modelId: modelConfig.model.modelId,
      supportThinking: modelConfig.model.supportThinking ?? undefined,
      reasoningEffort: modelConfig.model.reasoningEffort ?? undefined,
    },
    provider: modelConfig.provider,
    tools: agentTools,
  };
}
