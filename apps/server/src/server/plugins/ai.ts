/**
 * AI Plugin
 * 
 * 提供 AI 生成接口，支持普通请求和流式响应
 */

import { Elysia, t } from 'elysia';
import { generate, stream, stepCountIs, tool, jsonSchema, type UIMessage, type ToolSet } from '@qiyu-allinai/ai';
import { model, provider, agent, tool as toolTable } from '@qiyu-allinai/db';
import db from '@qiyu-allinai/db/connect';
import { eq, inArray } from 'drizzle-orm';
import { dbActions, filesActions, type ActionDefinition, type ActionContext } from '@qiyu-allinai/actions';
import { bearerPlugin } from './bearer';
import { jwtPlugin } from './jwt';
import { z } from 'zod/v4';

/** 所有可用的 Actions */
const allActions = [...dbActions, ...filesActions];

// ============ Flow Executor Types ============

/** 工作流定义 */
interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** 流程节点 */
interface FlowNode {
  id: string;
  type?: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

/** 流程边 */
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

/** 流程执行上下文 */
interface FlowActionContext {
  token?: string;
  currentUserId: string;
  currentUserName: string;
}

/** 流程 Action 定义 */
interface FlowActionDefinition {
  name: string;
  execute: (input: Record<string, unknown>, context: FlowActionContext) => Promise<unknown>;
}

/** 获取 Action 的函数类型 */
type GetActionByName = (name: string) => FlowActionDefinition | undefined;

/** 流程执行结果 */
interface FlowExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
}

/** 流程执行器配置 */
interface FlowExecutorConfig {
  getActionByName: GetActionByName;
  context: FlowActionContext;
  maxLoopIterations?: number;
}

/** 工具节点类型 */
type UtilType = 
  | 'toString' | 'toNumber' | 'toBoolean' | 'isType'
  | 'arrayCount' | 'arrayGet' | 'arrayFirst' | 'arrayLast' | 'arrayJoin'
  | 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo'
  | 'equal' | 'notEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'
  | 'and' | 'or' | 'not'
  | 'concat' | 'substring' | 'stringLength' | 'toUpperCase' | 'toLowerCase' | 'trim' | 'split' | 'replace' | 'includes';

// ============ Flow Executor Implementation ============

/** 执行工具节点 */
function executeUtil(utilType: UtilType, inputs: Record<string, unknown>): unknown {
  switch (utilType) {
    case 'toString': return String(inputs.value ?? '');
    case 'toNumber': return Number(inputs.value) || 0;
    case 'toBoolean': return Boolean(inputs.value);
    case 'isType': {
      const value = inputs.value;
      const checkType = inputs.checkType as string;
      if (checkType === 'array') return Array.isArray(value);
      if (checkType === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
      return typeof value === checkType;
    }
    case 'arrayCount': return Array.isArray(inputs.array) ? inputs.array.length : 0;
    case 'arrayGet': return Array.isArray(inputs.array) ? (inputs.array as unknown[])[inputs.index as number] : undefined;
    case 'arrayFirst': return Array.isArray(inputs.array) ? inputs.array[0] : undefined;
    case 'arrayLast': return Array.isArray(inputs.array) ? inputs.array[inputs.array.length - 1] : undefined;
    case 'arrayJoin': return Array.isArray(inputs.array) ? (inputs.array as unknown[]).join((inputs.separator as string) ?? ',') : '';
    case 'add': return (Number(inputs.a) || 0) + (Number(inputs.b) || 0);
    case 'subtract': return (Number(inputs.a) || 0) - (Number(inputs.b) || 0);
    case 'multiply': return (Number(inputs.a) || 0) * (Number(inputs.b) || 0);
    case 'divide': { const b = Number(inputs.b) || 0; return b !== 0 ? (Number(inputs.a) || 0) / b : 0; }
    case 'modulo': { const b = Number(inputs.b) || 0; return b !== 0 ? (Number(inputs.a) || 0) % b : 0; }
    case 'equal': return inputs.a === inputs.b;
    case 'notEqual': return inputs.a !== inputs.b;
    case 'greaterThan': return (Number(inputs.a) || 0) > (Number(inputs.b) || 0);
    case 'greaterThanOrEqual': return (Number(inputs.a) || 0) >= (Number(inputs.b) || 0);
    case 'lessThan': return (Number(inputs.a) || 0) < (Number(inputs.b) || 0);
    case 'lessThanOrEqual': return (Number(inputs.a) || 0) <= (Number(inputs.b) || 0);
    case 'and': return Boolean(inputs.a) && Boolean(inputs.b);
    case 'or': return Boolean(inputs.a) || Boolean(inputs.b);
    case 'not': return !Boolean(inputs.value);
    case 'concat': return String(inputs.a ?? '') + String(inputs.b ?? '');
    case 'substring': { const str = String(inputs.str ?? ''); return str.substring(Number(inputs.start) || 0, inputs.end !== undefined ? Number(inputs.end) : undefined); }
    case 'stringLength': return String(inputs.str ?? '').length;
    case 'toUpperCase': return String(inputs.str ?? '').toUpperCase();
    case 'toLowerCase': return String(inputs.str ?? '').toLowerCase();
    case 'trim': return String(inputs.str ?? '').trim();
    case 'split': return String(inputs.str ?? '').split(String(inputs.separator ?? ','));
    case 'replace': return String(inputs.str ?? '').replace(String(inputs.search ?? ''), String(inputs.replacement ?? ''));
    case 'includes': return String(inputs.str ?? '').includes(String(inputs.search ?? ''));
    default: throw new Error(`Unknown util type: ${utilType}`);
  }
}

/** 流程执行器 */
class FlowExecutor {
  private workflow: WorkflowDefinition;
  private config: FlowExecutorConfig;
  private nodeOutputs = new Map<string, Record<string, unknown>>();
  private variables = new Map<string, unknown>();
  private nodesMap = new Map<string, FlowNode>();
  private edgesMap = new Map<string, FlowEdge[]>();

  constructor(workflow: WorkflowDefinition, config: FlowExecutorConfig) {
    this.workflow = workflow;
    this.config = { maxLoopIterations: 1000, ...config };
    
    for (const node of workflow.nodes) {
      this.nodesMap.set(node.id, node);
    }
    for (const edge of workflow.edges) {
      const edges = this.edgesMap.get(edge.source) || [];
      edges.push(edge);
      this.edgesMap.set(edge.source, edges);
    }
  }

  async execute(input: Record<string, unknown>): Promise<FlowExecutionResult> {
    try {
      const startNode = this.workflow.nodes.find(n => n.type === 'start');
      if (!startNode) return { success: false, error: 'No start node found' };

      // 初始化变量池
      const variablePoolNode = this.workflow.nodes.find(n => n.type === 'variablePool');
      if (variablePoolNode) {
        const data = variablePoolNode.data as { variables?: Array<{ key: string; defaultValue?: unknown }> };
        for (const v of data.variables || []) {
          this.variables.set(v.key, v.defaultValue);
        }
      }

      this.nodeOutputs.set(startNode.id, input);
      await this.executeFromNode(startNode.id);

      const lastNodeId = Array.from(this.nodeOutputs.keys()).pop();
      return { success: true, output: lastNodeId ? this.nodeOutputs.get(lastNodeId) : undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async executeFromNode(nodeId: string): Promise<void> {
    const node = this.nodesMap.get(nodeId);
    if (!node) return;

    await this.executeNode(node);

    const outgoingEdges = this.edgesMap.get(nodeId) || [];
    for (const edge of outgoingEdges) {
      if (edge.sourceHandle?.startsWith('exec-') || edge.sourceHandle === 'exec') {
        await this.executeFromNode(edge.target);
      }
    }
  }

  private async executeNode(node: FlowNode): Promise<void> {
    const inputs = this.collectInputs(node);
    let output: unknown;

    switch (node.type) {
      case 'start':
        output = this.nodeOutputs.get(node.id);
        break;
      case 'variablePool':
        output = Object.fromEntries(this.variables);
        break;
      case 'action': {
        const data = node.data as { action?: { name?: string } };
        const actionName = data.action?.name;
        if (!actionName) throw new Error('Action node missing action name');
        const action = this.config.getActionByName(actionName);
        if (!action) throw new Error(`Action not found: ${actionName}`);
        output = await action.execute(inputs, this.config.context);
        break;
      }
      case 'util': {
        const data = node.data as { utilType?: UtilType };
        if (!data.utilType) throw new Error('Util node missing utilType');
        output = executeUtil(data.utilType, inputs);
        break;
      }
      case 'assign': {
        const data = node.data as { targetVariableKey?: string };
        if (data.targetVariableKey) {
          this.variables.set(data.targetVariableKey, inputs['value']);
        }
        output = inputs['value'];
        break;
      }
      case 'if': {
        const data = node.data as { hasElse?: boolean; ifChildNodeIds?: string[]; elseChildNodeIds?: string[] };
        const condition = Boolean(inputs['condition']);
        const childNodeIds = condition ? data.ifChildNodeIds : (data.hasElse ? data.elseChildNodeIds : []);
        for (const childId of childNodeIds || []) {
          await this.executeFromNode(childId);
        }
        output = this.nodeOutputs.get(childNodeIds?.[childNodeIds.length - 1] ?? '');
        break;
      }
      case 'loop': {
        const data = node.data as { childNodeIds?: string[] };
        const arrayInput = inputs['array'];
        const countInput = inputs['count'];
        let iterations = 0;
        let items: unknown[] | undefined;

        if (Array.isArray(arrayInput)) {
          items = arrayInput;
          iterations = items.length;
        } else if (typeof countInput === 'number') {
          iterations = countInput;
        }

        iterations = Math.min(iterations, this.config.maxLoopIterations!);
        const results: unknown[] = [];

        for (let i = 0; i < iterations; i++) {
          this.nodeOutputs.set(`${node.id}-loop`, { index: i, item: items ? items[i] : i });
          for (const childId of data.childNodeIds || []) {
            await this.executeFromNode(childId);
            const childOutput = this.nodeOutputs.get(childId);
            if (childOutput) results.push(childOutput);
          }
        }
        output = results;
        break;
      }
      default:
        output = inputs;
    }

    this.saveNodeOutput(node, output);
  }

  private collectInputs(node: FlowNode): Record<string, unknown> {
    const inputs: Record<string, unknown> = {};
    for (const edge of this.workflow.edges) {
      if (edge.target !== node.id || !edge.targetHandle || !edge.sourceHandle) continue;
      const targetKey = edge.targetHandle.replace('input-', '');
      const sourceKey = edge.sourceHandle.replace('output-', '');
      const sourceOutputs = this.nodeOutputs.get(edge.source);
      if (sourceOutputs) {
        inputs[targetKey] = sourceOutputs[sourceKey] ?? sourceOutputs;
      }
    }
    return inputs;
  }

  private saveNodeOutput(node: FlowNode, output: unknown): void {
    const outputs: Record<string, unknown> = {};
    if (typeof output === 'object' && output !== null && !Array.isArray(output)) {
      Object.assign(outputs, output);
    } else {
      outputs['result'] = output;
    }
    this.nodeOutputs.set(node.id, outputs);
  }
}

// ============ AI Plugin Implementation ============

/** 消息部分 Schema */
const messagePartSchema = t.Union([
  t.Object({
    type: t.Literal('text'),
    text: t.String(),
  }),
  t.Object({
    type: t.Literal('tool-invocation'),
    toolInvocation: t.Object({
      toolCallId: t.String(),
      toolName: t.String(),
      args: t.Unknown(),
      state: t.String(),
      result: t.Optional(t.Unknown()),
    }),
  }),
]);

/** UIMessage Schema */
const uiMessageSchema = t.Object({
  id: t.String(),
  role: t.Union([t.Literal('user'), t.Literal('assistant'), t.Literal('system')]),
  content: t.String(),
  parts: t.Array(messagePartSchema),
});

/** Tool 定义 Schema */
const toolDefinitionSchema = t.Object({
  description: t.String(),
  parameters: t.Record(t.String(), t.Unknown()),
});

/** 请求体 Schema */
const chatRequestSchema = t.Object({
  modelId: t.String({ format: 'uuid' }),
  messages: t.Array(uiMessageSchema),
  system: t.Optional(t.String()),
  tools: t.Optional(t.Record(t.String(), toolDefinitionSchema)),
  toolChoice: t.Optional(t.Union([
    t.Literal('auto'),
    t.Literal('none'),
    t.Literal('required'),
  ])),
  maxSteps: t.Optional(t.Number()),
});

/** 前端传入的 Tool 定义 */
interface ClientToolDefinition {
  description: string;
  parameters: Record<string, unknown>;
}

/** 空 JSON Schema 对象 */
const emptyJsonSchema = jsonSchema<Record<string, never>>({
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false,
});

/** 将前端 tools 转换为 ai sdk tools（无执行逻辑，用于普通 chat） */
function convertClientTools(clientTools?: Record<string, ClientToolDefinition>): ToolSet {
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

/** 获取 model 和 provider 配置 */
async function getModelConfig(modelId: string) {
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

  return { model: modelRecord, provider: providerRecord };
}

/** 构建 Actions Map 用于快速查找 */
function buildActionsMap() {
  const actionsMap = new Map<string, ActionDefinition>();
  for (const action of allActions) {
    actionsMap.set(action.meta.name, action);
  }
  return actionsMap;
}

/** 合并 action 的所有 schema 为单个输入 schema */
function mergeActionSchemas(action: ActionDefinition) {
  return z.object({
    query: action.schemas.querySchema,
    params: action.schemas.paramsSchema,
    body: action.schemas.bodySchema
  });
}

/** 将 Action 转换为 AI SDK Tool（使用 inputSchema） */
function actionToAITool(action: ActionDefinition, context: ActionContext) {
  const inputSchema = mergeActionSchemas(action);
  
  return tool({
    description: action.meta.description,
    inputSchema,
    execute: async (input) => {
      return action.execute(input, context);
    },
  });
}

/** 获取 agent 完整配置（包括 model、provider、tools） */
async function getAgentConfig(agentId: string, actionContext: ActionContext) {
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

  // 1. 处理 nativeTools（直接执行 action）
  const nativeTools = agentRecord.nativeTools as string[] | null;
  if (nativeTools && nativeTools.length > 0) {
    for (const actionName of nativeTools) {
      const action = actionsMap.get(actionName);
      if (!action) continue;
      agentTools[actionName] = actionToAITool(action, actionContext);
    }
  }

  // 2. 处理 toolIds（自定义 tool，带 workflow implementation）
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
    model: modelConfig.model,
    provider: modelConfig.provider,
    tools: agentTools,
  };
}

/** Agent 请求体 Schema */
const agentChatRequestSchema = t.Object({
  agentId: t.String({ format: 'uuid' }),
  messages: t.Array(uiMessageSchema),
  tools: t.Optional(t.Record(t.String(), toolDefinitionSchema)),
  toolChoice: t.Optional(t.Union([
    t.Literal('auto'),
    t.Literal('none'),
    t.Literal('required'),
  ])),
  maxSteps: t.Optional(t.Number()),
});

export const aiPlugin = new Elysia({ name: 'plugin/ai' })
  .use(bearerPlugin)
  .use(jwtPlugin)
  .post('/api/ai/chat', async ({ body }) => {
    const { modelId, messages, system, tools: clientTools, toolChoice, maxSteps } = body;
    const config = await getModelConfig(modelId);
    const tools = convertClientTools(clientTools);

    const result = await generate({
      provider: {
        name: config.provider.name,
        baseURL: config.provider.baseUrl,
        apiKey: config.provider.token,
      },
      model: config.model.modelId,
      messages: messages as UIMessage[],
      system,
      toolChoice,
      tools,
      stopWhen: stepCountIs(maxSteps ?? 5),
    });

    return {
      text: result.text,
      finishReason: result.finishReason,
      usage: result.usage,
    };
  }, {
    body: chatRequestSchema,
    detail: {
      tags: ['AI'],
      summary: 'AI 对话（普通请求）',
      description: '发送消息到 AI 模型，返回完整响应',
    },
  })
  .post('/api/ai/chat/stream', async ({ body }) => {
    const { modelId, messages, system, tools: clientTools, toolChoice, maxSteps } = body;
    const config = await getModelConfig(modelId);
    const tools = convertClientTools(clientTools);

    const result = await stream({
      provider: {
        name: config.provider.name,
        baseURL: config.provider.baseUrl,
        apiKey: config.provider.token,
      },
      model: config.model.modelId,
      messages: messages as UIMessage[],
      system,
      toolChoice,
      tools,
      stopWhen: stepCountIs(maxSteps ?? 5),
    });

    return result.toUIMessageStreamResponse();
  }, {
    body: chatRequestSchema,
    detail: {
      tags: ['AI'],
      summary: 'AI 对话（流式响应）',
      description: '发送消息到 AI 模型，返回 UIMessage 流式响应',
    },
  })
  .post('/api/ai/chat/fromAgent', async ({ body, bearer, jwt }) => {
    const { agentId, messages, tools: clientTools, toolChoice, maxSteps } = body;

    const actionContext: ActionContext = {
      currentUserId: '',
      currentUserName: '',
      token: bearer || '',
    };

    if (bearer) {
      const payload = await jwt.verify(bearer);
      if (payload && typeof payload === 'object' && 'sub' in payload) {
        actionContext.currentUserId = payload.sub as string;
        actionContext.currentUserName = (payload as Record<string, unknown>).name as string || '';
      }
    }

    const config = await getAgentConfig(agentId, actionContext);
    const mergedTools = {
      ...config.tools,
      ...convertClientTools(clientTools),
    };

    const result = await stream({
      provider: {
        name: config.provider.name,
        baseURL: config.provider.baseUrl,
        apiKey: config.provider.token,
      },
      model: config.model.modelId,
      messages: messages as UIMessage[],
      system: config.agent.systemPrompt ?? undefined,
      toolChoice: toolChoice ?? (Object.keys(mergedTools).length > 0 ? 'auto' : 'none'),
      tools: mergedTools,
      stopWhen: stepCountIs(maxSteps ?? config.agent.maxLoops ?? 10),
    });

    return result.toUIMessageStreamResponse();
  }, {
    body: agentChatRequestSchema,
    detail: {
      tags: ['AI'],
      summary: 'Agent 对话（流式响应）',
      description: '使用 Agent 配置进行对话，自动加载 Agent 的 model、system prompt 和 tools（包括 nativeTools 和自定义 tools）',
    },
  });
