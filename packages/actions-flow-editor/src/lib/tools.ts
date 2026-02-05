/**
 * ActionsFlowEditor AI Tools 定义
 * 
 * 用于 AI Agent 操作流程编辑器的工具定义
 */

import { z } from 'zod';
import type {
  ActionsFlowEditorRef,
  UtilType,
  VariableDefinition,
  LayoutDirection,
} from './types.js';

/** 工具类型枚举 */
const utilTypeEnum = z.enum([
  'toString', 'toNumber', 'toBoolean', 'isType',
  'arrayCount', 'arrayGet', 'arrayFirst', 'arrayLast', 'arrayJoin',
  'add', 'subtract', 'multiply', 'divide', 'modulo',
  'equal', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual',
  'and', 'or', 'not',
  'concat', 'substring', 'stringLength', 'toUpperCase', 'toLowerCase', 'trim', 'split', 'replace', 'includes',
]);

/** 变量类型枚举 */
const variableTypeEnum = z.enum(['string', 'number', 'boolean']);

/** 布局方向枚举 */
const layoutDirectionEnum = z.enum(['LR', 'TB', 'RL', 'BT']);

/** 位置 Schema */
const positionSchema = z.object({
  x: z.number().describe('X 坐标'),
  y: z.number().describe('Y 坐标'),
}).optional();

/** ActionsFlowEditor 客户端工具定义（不含 execute，用于后端 streamText） */
export const actionsFlowEditorTools = {
  // 工作流
  getWorkflow: {
    description: '获取当前工作流的完整定义，包括所有节点和边',
    inputSchema: z.object({}),
  },
  validateWorkflow: {
    description: '验证工作流是否有效（检查未连接的必填输入等）',
    inputSchema: z.object({}),
  },
  // 节点
  getNodes: {
    description: '获取工作流中的所有节点',
    inputSchema: z.object({}),
  },
  getNodeById: {
    description: '根据 ID 获取节点详情',
    inputSchema: z.object({ nodeId: z.string().describe('节点 ID') }),
  },
  getNodesByType: {
    description: '根据类型获取所有匹配的节点',
    inputSchema: z.object({ type: z.string().describe('节点类型（如 action, util, start, variablePool, assign, if, loop）') }),
  },
  addActionNode: {
    description: '添加一个 Action 节点到工作流',
    inputSchema: z.object({
      actionName: z.string().describe('Action 名称（如 system.user.getByPagination）'),
      position: positionSchema.describe('节点位置（可选）'),
    }),
  },
  addUtilNode: {
    description: '添加一个工具节点（如类型转换、数组操作、算术运算等）',
    inputSchema: z.object({
      utilType: utilTypeEnum.describe('工具类型'),
      position: positionSchema.describe('节点位置（可选）'),
    }),
  },
  addAssignNode: {
    description: '添加一个赋值节点，用于将值赋给变量',
    inputSchema: z.object({ position: positionSchema.describe('节点位置（可选）') }),
  },
  addIfNode: {
    description: '添加一个条件节点（If），用于分支逻辑',
    inputSchema: z.object({ position: positionSchema.describe('节点位置（可选）') }),
  },
  addLoopNode: {
    description: '添加一个循环节点（Loop），用于遍历数组或执行固定次数',
    inputSchema: z.object({ position: positionSchema.describe('节点位置（可选）') }),
  },
  removeNode: {
    description: '删除指定节点（注意：start 和 variablePool 节点不可删除）',
    inputSchema: z.object({ nodeId: z.string().describe('节点 ID') }),
  },
  updateNodePosition: {
    description: '更新节点的位置',
    inputSchema: z.object({
      nodeId: z.string().describe('节点 ID'),
      position: z.object({ x: z.number(), y: z.number() }).describe('新位置'),
    }),
  },
  // 边
  getEdges: {
    description: '获取工作流中的所有连接边',
    inputSchema: z.object({}),
  },
  getNodeConnections: {
    description: '获取指定节点的所有入边和出边',
    inputSchema: z.object({ nodeId: z.string().describe('节点 ID') }),
  },
  connectNodes: {
    description: '连接两个节点的引脚',
    inputSchema: z.object({
      sourceNodeId: z.string().describe('源节点 ID'),
      sourceHandle: z.string().describe('源节点输出引脚 ID（如 output-result）'),
      targetNodeId: z.string().describe('目标节点 ID'),
      targetHandle: z.string().describe('目标节点输入引脚 ID（如 input-data）'),
    }),
  },
  disconnectNodes: {
    description: '删除指定的连接边',
    inputSchema: z.object({ edgeId: z.string().describe('边 ID') }),
  },
  disconnectAllFromNode: {
    description: '断开指定节点的所有连接',
    inputSchema: z.object({ nodeId: z.string().describe('节点 ID') }),
  },
  // Actions
  getActions: {
    description: '获取所有可用的 Actions 列表',
    inputSchema: z.object({}),
  },
  searchActions: {
    description: '根据关键词搜索 Actions',
    inputSchema: z.object({ keyword: z.string().describe('搜索关键词') }),
  },
  // 变量
  getVariables: {
    description: '获取变量池中的所有变量',
    inputSchema: z.object({}),
  },
  addVariable: {
    description: '向变量池添加新变量',
    inputSchema: z.object({
      key: z.string().describe('变量名'),
      type: variableTypeEnum.describe('变量类型'),
      defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional().describe('默认值'),
      description: z.string().optional().describe('变量描述'),
    }),
  },
  removeVariable: {
    description: '从变量池删除变量',
    inputSchema: z.object({ variableKey: z.string().describe('变量名') }),
  },
  // 布局
  applyLayout: {
    description: '应用自动布局整理节点位置',
    inputSchema: z.object({
      direction: layoutDirectionEnum.optional().describe('布局方向：LR(左到右), TB(上到下), RL(右到左), BT(下到上)'),
    }),
  },
  // 调试
  getDebugState: {
    description: '获取所有节点的调试状态',
    inputSchema: z.object({}),
  },
  getNodeDebugResult: {
    description: '获取指定节点的调试结果',
    inputSchema: z.object({ nodeId: z.string().describe('节点 ID') }),
  },
  clearDebugState: {
    description: '清除所有节点的调试状态',
    inputSchema: z.object({}),
  },
  // 其他
  getInputSchema: {
    description: '获取 Start 节点的输入 Schema',
    inputSchema: z.object({}),
  },
} as const;

/** 工具名称类型 */
export type ActionsFlowEditorToolName = keyof typeof actionsFlowEditorTools;

/** Tool 调用结果 */
export interface ToolCallResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

/** 位置类型 */
interface Position {
  x: number;
  y: number;
}

/**
 * 执行 ActionsFlowEditor 工具调用
 * @param editorRef - 编辑器 ref
 * @param toolName - 工具名称
 * @param input - 工具输入参数
 * @returns 工具执行结果（Promise，因为 addActionNode 是异步的）
 */
export async function callTool(
  editorRef: ActionsFlowEditorRef,
  toolName: ActionsFlowEditorToolName,
  input: Record<string, unknown>
): Promise<ToolCallResult> {
  switch (toolName) {
    // 工作流
    case 'getWorkflow': {
      const workflow = editorRef.getWorkflow();
      return { success: true, workflow };
    }
    case 'validateWorkflow': {
      const result = editorRef.validateWorkflow();
      return { success: true, ...result };
    }
    // 节点
    case 'getNodes': {
      const nodes = editorRef.getNodes();
      return { success: true, nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position })) };
    }
    case 'getNodeById': {
      const node = editorRef.getNodeById(input.nodeId as string);
      if (node) {
        return { success: true, node: { id: node.id, type: node.type, position: node.position, data: node.data } };
      }
      return { success: false, error: '节点不存在' };
    }
    case 'getNodesByType': {
      const nodes = editorRef.getNodesByType(input.type as string);
      return { success: true, nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position })) };
    }
    case 'addActionNode': {
      const node = await editorRef.addActionNode(input.actionName as string, input.position as Position | undefined);
      if (node) {
        return { success: true, nodeId: node.id };
      }
      return { success: false, error: 'Action 不存在或添加失败' };
    }
    case 'addUtilNode': {
      const node = editorRef.addUtilNodeAt(input.utilType as UtilType, input.position as Position | undefined);
      return { success: true, nodeId: node.id };
    }
    case 'addAssignNode': {
      const node = editorRef.addAssignNodeAt(input.position as Position | undefined);
      return { success: true, nodeId: node.id };
    }
    case 'addIfNode': {
      const node = editorRef.addIfNodeAt(input.position as Position | undefined);
      return { success: true, nodeId: node.id };
    }
    case 'addLoopNode': {
      const node = editorRef.addLoopNodeAt(input.position as Position | undefined);
      return { success: true, nodeId: node.id };
    }
    case 'removeNode': {
      const success = editorRef.removeNode(input.nodeId as string);
      return { success, error: success ? undefined : '删除失败' };
    }
    case 'updateNodePosition': {
      const success = editorRef.updateNodePosition(input.nodeId as string, input.position as Position);
      return { success, error: success ? undefined : '更新失败' };
    }
    // 边
    case 'getEdges': {
      const edges = editorRef.getEdges();
      return { success: true, edges: edges.map(e => ({ id: e.id, source: e.source, sourceHandle: e.sourceHandle, target: e.target, targetHandle: e.targetHandle })) };
    }
    case 'getNodeConnections': {
      const { incoming, outgoing } = editorRef.getEdgesByNodeId(input.nodeId as string);
      return {
        success: true,
        incoming: incoming.map(e => ({ id: e.id, source: e.source, sourceHandle: e.sourceHandle })),
        outgoing: outgoing.map(e => ({ id: e.id, target: e.target, targetHandle: e.targetHandle })),
      };
    }
    case 'connectNodes': {
      const { sourceNodeId, sourceHandle, targetNodeId, targetHandle } = input as {
        sourceNodeId: string;
        sourceHandle: string;
        targetNodeId: string;
        targetHandle: string;
      };
      const success = editorRef.connectNodes(sourceNodeId, sourceHandle, targetNodeId, targetHandle);
      return { success, error: success ? undefined : '连接失败' };
    }
    case 'disconnectNodes': {
      const success = editorRef.disconnectNodes(input.edgeId as string);
      return { success, error: success ? undefined : '断开失败' };
    }
    case 'disconnectAllFromNode': {
      const count = editorRef.disconnectAllFromNode(input.nodeId as string);
      return { success: true, disconnectedCount: count };
    }
    // Actions
    case 'getActions': {
      const actions = editorRef.getActions();
      return { success: true, actions: actions.map(a => ({ name: a.name, displayName: a.displayName, description: a.description, tags: a.tags })) };
    }
    case 'searchActions': {
      const actions = editorRef.searchActions(input.keyword as string);
      return { success: true, actions: actions.map(a => ({ name: a.name, displayName: a.displayName, description: a.description })) };
    }
    // 变量
    case 'getVariables': {
      const variables = editorRef.getVariables();
      return { success: true, variables };
    }
    case 'addVariable': {
      const { key, type, defaultValue, description } = input as {
        key: string;
        type: 'string' | 'number' | 'boolean';
        defaultValue?: string | number | boolean;
        description?: string;
      };
      const variable: VariableDefinition = { key, type, defaultValue, description };
      const success = editorRef.addVariable(variable);
      return { success, error: success ? undefined : '添加失败' };
    }
    case 'removeVariable': {
      const success = editorRef.removeVariable(input.variableKey as string);
      return { success, error: success ? undefined : '删除失败' };
    }
    // 布局
    case 'applyLayout': {
      editorRef.applyLayout(input.direction as LayoutDirection | undefined);
      return { success: true };
    }
    // 调试
    case 'getDebugState': {
      const debugState = editorRef.getDebugState();
      const result: Record<string, unknown> = {};
      debugState.forEach((value, key) => { result[key] = value; });
      return { success: true, debugState: result };
    }
    case 'getNodeDebugResult': {
      const result = editorRef.getNodeDebugResult(input.nodeId as string);
      if (result) {
        return { success: true, result };
      }
      return { success: false, error: '没有调试结果' };
    }
    case 'clearDebugState': {
      editorRef.clearDebugState();
      return { success: true };
    }
    // 其他
    case 'getInputSchema': {
      const schema = editorRef.getInputSchema();
      return { success: true, schema };
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
 * 将 actionsFlowEditorTools 转换为后端 API 需要的格式
 * @returns 转换后的 tools 对象
 */
export function getToolsForApi(): Record<string, ApiToolDefinition> {
  const result: Record<string, ApiToolDefinition> = {};

  for (const [name, def] of Object.entries(actionsFlowEditorTools)) {
    result[name] = {
      description: def.description,
      parameters: z.toJSONSchema(def.inputSchema),
    };
  }

  return result;
}
