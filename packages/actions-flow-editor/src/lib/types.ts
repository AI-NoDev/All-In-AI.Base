import type { Node, Edge } from '@xyflow/svelte';

/** Context key for nodes getter */
export const NODES_CONTEXT_KEY = Symbol('nodes-context');

/** Context key for edges getter */
export const EDGES_CONTEXT_KEY = Symbol('edges-context');

/** Context key for edge delete function */
export const EDGE_DELETE_CONTEXT_KEY = Symbol('edge-delete-context');

/** Context key for debug state */
export const DEBUG_STATE_CONTEXT_KEY = Symbol('debug-state-context');

/** Context key for run node function */
export const RUN_NODE_CONTEXT_KEY = Symbol('run-node-context');

/** Context key for opening debug dialog */
export const OPEN_DEBUG_DIALOG_CONTEXT_KEY = Symbol('open-debug-dialog-context');

/** Nodes getter function type */
export type NodesGetter = () => Node[];

/** Edges getter function type */
export type EdgesGetter = () => Edge[];

/** Edge delete function type */
export type EdgeDeleter = (edgeId: string) => void;

/** 节点调试状态 */
export type NodeDebugStatus = 'idle' | 'running' | 'success' | 'error';

/** 节点调试结果 */
export interface NodeDebugResult {
  status: NodeDebugStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  timestamp?: number;
}

/** 调试状态 Map */
export type DebugStateMap = Map<string, NodeDebugResult>;

/** 调试状态 getter */
export type DebugStateGetter = () => DebugStateMap;

/** 运行节点函数类型 */
export type RunNodeFn = (nodeId: string, nodeName: string, input: Record<string, unknown>) => Promise<void>;

/** 打开调试对话框的参数 */
export interface OpenDebugDialogParams {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  initialInput: Record<string, unknown>;
  /** Action 节点的输入 Schema（用于生成模拟数据） */
  inputSchema?: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
}

/** 打开调试对话框函数类型 */
export type OpenDebugDialogFn = (params: OpenDebugDialogParams) => void;

/** Action 摘要信息 */
export interface ActionSummary {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  method: string;
  path: string;
}

/** Action 详情（含 Schema） */
export interface ActionDetail extends ActionSummary {
  inputSchema: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
  outputSchema: Record<string, unknown>;
}

/** JSON Schema 属性 */
export interface JsonSchemaProperty {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  required?: string[];
  [key: string]: unknown;
}

/** Action 节点数据 */
export interface ActionNodeData extends Record<string, unknown> {
  action: ActionDetail;
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  onDelete?: (nodeId: string) => void;
}

/** Start 节点数据 */
export interface StartNodeData extends Record<string, unknown> {
  inputSchema: Record<string, JsonSchemaProperty>;
  onDelete?: (nodeId: string) => void;
}

/** Output 节点数据（结束节点，只有输入引脚） */
export interface OutputNodeData extends Record<string, unknown> {
  outputSchema: Record<string, JsonSchemaProperty>;
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  onDelete?: (nodeId: string) => void;
}

/** 工具节点类型枚举 */
export type UtilType = 
  // 类型转换
  | 'toString' 
  | 'toNumber'
  | 'toBoolean'
  // 类型检查
  | 'isType' 
  // 数组操作
  | 'arrayCount'
  | 'arrayGet'
  | 'arrayFirst'
  | 'arrayLast'
  | 'arrayJoin'
  // 算术运算
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'modulo'
  // 比较运算
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  // 逻辑运算
  | 'and'
  | 'or'
  | 'not'
  // 字符串操作
  | 'concat'
  | 'substring'
  | 'stringLength'
  | 'toUpperCase'
  | 'toLowerCase'
  | 'trim'
  | 'split'
  | 'replace'
  | 'includes';

/** 支持的基础类型 */
export type BaseType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/** 工具节点数据 */
export interface UtilNodeData extends Record<string, unknown> {
  utilType: UtilType;
  config: {
    inputType?: BaseType;
    checkType?: BaseType;
  };
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  onConfigChange?: (nodeId: string, config: UtilNodeData['config']) => void;
  onDelete?: (nodeId: string) => void;
}

/** 工具节点定义 */
export interface UtilDefinition {
  type: UtilType;
  displayName: string;
  description: string;
  inputs: Array<{
    key: string;
    type: string;
    required: boolean;
    configurable?: boolean;
  }>;
  outputs: Array<{
    key: string;
    type: string;
  }>;
}

/** 内置工具定义 */
export const UTIL_DEFINITIONS: Record<UtilType, UtilDefinition> = {
  // ============ 类型转换 ============
  toString: {
    type: 'toString',
    displayName: '转字符串',
    description: '将任意类型转换为字符串',
    inputs: [{ key: 'value', type: 'string|number|boolean|object|array', required: true, configurable: true }],
    outputs: [{ key: 'result', type: 'string' }],
  },
  toNumber: {
    type: 'toNumber',
    displayName: '转数字',
    description: '将字符串或布尔值转换为数字',
    inputs: [{ key: 'value', type: 'string|boolean', required: true }],
    outputs: [{ key: 'result', type: 'number' }],
  },
  toBoolean: {
    type: 'toBoolean',
    displayName: '转布尔',
    description: '将任意值转换为布尔值',
    inputs: [{ key: 'value', type: 'string|number|boolean|object|array', required: true }],
    outputs: [{ key: 'result', type: 'boolean' }],
  },

  // ============ 类型检查 ============
  isType: {
    type: 'isType',
    displayName: '类型检查',
    description: '检查输入值是否为指定类型',
    inputs: [{ key: 'value', type: 'string|number|boolean|object|array', required: true }],
    outputs: [{ key: 'result', type: 'boolean' }],
  },

  // ============ 数组操作 ============
  arrayCount: {
    type: 'arrayCount',
    displayName: '数组长度',
    description: '获取数组的元素数量',
    inputs: [{ key: 'array', type: 'array', required: true }],
    outputs: [{ key: 'count', type: 'number' }],
  },
  arrayGet: {
    type: 'arrayGet',
    displayName: '获取元素',
    description: '根据索引获取数组元素',
    inputs: [
      { key: 'array', type: 'array', required: true },
      { key: 'index', type: 'number', required: true },
    ],
    outputs: [{ key: 'element', type: 'object' }],
  },
  arrayFirst: {
    type: 'arrayFirst',
    displayName: '首个元素',
    description: '获取数组的第一个元素',
    inputs: [{ key: 'array', type: 'array', required: true }],
    outputs: [{ key: 'element', type: 'object' }],
  },
  arrayLast: {
    type: 'arrayLast',
    displayName: '末尾元素',
    description: '获取数组的最后一个元素',
    inputs: [{ key: 'array', type: 'array', required: true }],
    outputs: [{ key: 'element', type: 'object' }],
  },
  arrayJoin: {
    type: 'arrayJoin',
    displayName: '数组拼接',
    description: '将数组元素用分隔符拼接成字符串',
    inputs: [
      { key: 'array', type: 'array', required: true },
      { key: 'separator', type: 'string', required: false },
    ],
    outputs: [{ key: 'result', type: 'string' }],
  },

  // ============ 算术运算 ============
  add: {
    type: 'add',
    displayName: '加法',
    description: '计算两个数的和',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'number' }],
  },
  subtract: {
    type: 'subtract',
    displayName: '减法',
    description: '计算两个数的差 (a - b)',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'number' }],
  },
  multiply: {
    type: 'multiply',
    displayName: '乘法',
    description: '计算两个数的积',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'number' }],
  },
  divide: {
    type: 'divide',
    displayName: '除法',
    description: '计算两个数的商 (a / b)',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'number' }],
  },
  modulo: {
    type: 'modulo',
    displayName: '取余',
    description: '计算两个数的余数 (a % b)',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'number' }],
  },

  // ============ 比较运算 ============
  equal: {
    type: 'equal',
    displayName: '等于',
    description: '判断两个值是否相等',
    inputs: [
      { key: 'a', type: 'string|number|boolean', required: true },
      { key: 'b', type: 'string|number|boolean', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  notEqual: {
    type: 'notEqual',
    displayName: '不等于',
    description: '判断两个值是否不相等',
    inputs: [
      { key: 'a', type: 'string|number|boolean', required: true },
      { key: 'b', type: 'string|number|boolean', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  greaterThan: {
    type: 'greaterThan',
    displayName: '大于',
    description: '判断 a 是否大于 b',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  greaterThanOrEqual: {
    type: 'greaterThanOrEqual',
    displayName: '大于等于',
    description: '判断 a 是否大于或等于 b',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  lessThan: {
    type: 'lessThan',
    displayName: '小于',
    description: '判断 a 是否小于 b',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  lessThanOrEqual: {
    type: 'lessThanOrEqual',
    displayName: '小于等于',
    description: '判断 a 是否小于或等于 b',
    inputs: [
      { key: 'a', type: 'number', required: true },
      { key: 'b', type: 'number', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },

  // ============ 逻辑运算 ============
  and: {
    type: 'and',
    displayName: '与',
    description: '逻辑与运算 (a && b)',
    inputs: [
      { key: 'a', type: 'boolean', required: true },
      { key: 'b', type: 'boolean', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  or: {
    type: 'or',
    displayName: '或',
    description: '逻辑或运算 (a || b)',
    inputs: [
      { key: 'a', type: 'boolean', required: true },
      { key: 'b', type: 'boolean', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
  not: {
    type: 'not',
    displayName: '非',
    description: '逻辑非运算 (!value)',
    inputs: [{ key: 'value', type: 'boolean', required: true }],
    outputs: [{ key: 'result', type: 'boolean' }],
  },

  // ============ 字符串操作 ============
  concat: {
    type: 'concat',
    displayName: '字符串拼接',
    description: '拼接两个字符串',
    inputs: [
      { key: 'a', type: 'string', required: true },
      { key: 'b', type: 'string', required: true },
    ],
    outputs: [{ key: 'result', type: 'string' }],
  },
  substring: {
    type: 'substring',
    displayName: '截取字符串',
    description: '截取字符串的一部分',
    inputs: [
      { key: 'str', type: 'string', required: true },
      { key: 'start', type: 'number', required: true },
      { key: 'end', type: 'number', required: false },
    ],
    outputs: [{ key: 'result', type: 'string' }],
  },
  stringLength: {
    type: 'stringLength',
    displayName: '字符串长度',
    description: '获取字符串的长度',
    inputs: [{ key: 'str', type: 'string', required: true }],
    outputs: [{ key: 'length', type: 'number' }],
  },
  toUpperCase: {
    type: 'toUpperCase',
    displayName: '转大写',
    description: '将字符串转换为大写',
    inputs: [{ key: 'str', type: 'string', required: true }],
    outputs: [{ key: 'result', type: 'string' }],
  },
  toLowerCase: {
    type: 'toLowerCase',
    displayName: '转小写',
    description: '将字符串转换为小写',
    inputs: [{ key: 'str', type: 'string', required: true }],
    outputs: [{ key: 'result', type: 'string' }],
  },
  trim: {
    type: 'trim',
    displayName: '去除空白',
    description: '去除字符串首尾的空白字符',
    inputs: [{ key: 'str', type: 'string', required: true }],
    outputs: [{ key: 'result', type: 'string' }],
  },
  split: {
    type: 'split',
    displayName: '分割字符串',
    description: '按分隔符分割字符串为数组',
    inputs: [
      { key: 'str', type: 'string', required: true },
      { key: 'separator', type: 'string', required: true },
    ],
    outputs: [{ key: 'result', type: 'array' }],
  },
  replace: {
    type: 'replace',
    displayName: '替换字符串',
    description: '替换字符串中的内容',
    inputs: [
      { key: 'str', type: 'string', required: true },
      { key: 'search', type: 'string', required: true },
      { key: 'replacement', type: 'string', required: true },
    ],
    outputs: [{ key: 'result', type: 'string' }],
  },
  includes: {
    type: 'includes',
    displayName: '包含检查',
    description: '检查字符串是否包含指定内容',
    inputs: [
      { key: 'str', type: 'string', required: true },
      { key: 'search', type: 'string', required: true },
    ],
    outputs: [{ key: 'result', type: 'boolean' }],
  },
};

/** 变量类型 */
export type VariableType = 'string' | 'number' | 'boolean';

/** 变量定义 */
export interface VariableDefinition {
  key: string;
  type: VariableType;
  defaultValue?: string | number | boolean;
  description?: string;
}

/** 变量池节点数据 */
export interface VariablePoolNodeData extends Record<string, unknown> {
  variables: VariableDefinition[];
  onVariablesChange?: (nodeId: string, variables: VariableDefinition[]) => void;
  onDelete?: (nodeId: string) => void;
}

/** 赋值节点数据 */
export interface AssignNodeData extends Record<string, unknown> {
  targetVariableKey: string;
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  availableVariables: VariableDefinition[];
  onTargetChange?: (nodeId: string, targetKey: string) => void;
  onDelete?: (nodeId: string) => void;
}

// ============ 新的循环节点设计 ============
// 循环节点内嵌 SubFlow，顶部有 index 和 item 两个向内输出引脚

/** 循环节点数据 (新设计) */
export interface LoopNodeData extends Record<string, unknown> {
  /** 输入类型: number 或 array<T> */
  inputType: string;
  /** 循环项类型（从 inputType 推导） */
  itemType: string;
  /** 循环项的完整 Schema（用于 object 类型展开） */
  itemSchema?: JsonSchemaProperty;
  /** 输入参数的连接映射 */
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  /** SubFlow 内的子节点 ID 列表 */
  childNodeIds: string[];
  /** SubFlow 尺寸 */
  subflowSize: { width: number; height: number };
  /** 删除回调 */
  onDelete?: (nodeId: string) => void;
  /** 尺寸变更回调 */
  onSizeChange?: (nodeId: string, size: { width: number; height: number }) => void;
}

// ============ 新的条件节点设计 ============
// 条件节点：左边输入，右边 if SubFlow，可选 else SubFlow

/** 条件节点数据 (新设计) */
export interface IfNodeData extends Record<string, unknown> {
  /** 输入参数的连接映射 */
  inputMappings: Record<string, { nodeId: string; outputKey: string }>;
  /** 是否启用 else 分支 */
  hasElse: boolean;
  /** if SubFlow 内的子节点 ID 列表 */
  ifChildNodeIds: string[];
  /** else SubFlow 内的子节点 ID 列表 */
  elseChildNodeIds: string[];
  /** if SubFlow 尺寸 */
  ifSubflowSize: { width: number; height: number };
  /** else SubFlow 尺寸 */
  elseSubflowSize: { width: number; height: number };
  /** 删除回调 */
  onDelete?: (nodeId: string) => void;
  /** else 开关变更回调 */
  onElseToggle?: (nodeId: string, hasElse: boolean) => void;
  /** 尺寸变更回调 */
  onSizeChange?: (nodeId: string, ifSize: { width: number; height: number }, elseSize?: { width: number; height: number }) => void;
}

// ============ 节点类型定义 ============

export type ActionNode = Node<ActionNodeData, 'action'>;
export type StartNode = Node<StartNodeData, 'start'>;
export type OutputNode = Node<OutputNodeData, 'end'>;
export type UtilNode = Node<UtilNodeData, 'util'>;
export type VariablePoolNode = Node<VariablePoolNodeData, 'variablePool'>;
export type AssignNode = Node<AssignNodeData, 'assign'>;
export type LoopNode = Node<LoopNodeData, 'loop'>;
export type IfNode = Node<IfNodeData, 'if'>;

/** 流程节点类型 */
export type FlowNode = ActionNode | StartNode | OutputNode | UtilNode | VariablePoolNode | AssignNode | LoopNode | IfNode;

/** 流程边类型 */
export type FlowEdge = Edge;

/** 工作流定义 */
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  inputSchema?: Record<string, JsonSchemaProperty>;
}

/** 编辑器 Props */
export interface ActionsFlowEditorProps {
  actions: ActionSummary[];
  getActionDetail: (name: string) => Promise<ActionDetail>;
  initialWorkflow?: WorkflowDefinition;
  onWorkflowChange?: (workflow: WorkflowDefinition) => void;
}

// ==================== Ref Methods Interface ====================

/** 所有节点数据类型的联合 */
export type AllNodeData = ActionNodeData | StartNodeData | OutputNodeData | UtilNodeData | VariablePoolNodeData | AssignNodeData | LoopNodeData | IfNodeData;

/** 布局方向 */
export type LayoutDirection = 'LR' | 'TB' | 'RL' | 'BT';

/**
 * ActionsFlowEditor 组件的 ref 方法接口
 * 用于通过 bind:this 获取组件实例后调用方法
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { ActionsFlowEditor, type ActionsFlowEditorRef } from '@qiyu-allinai/actions-flow-editor';
 *   let editorRef: ActionsFlowEditorRef;
 * </script>
 * 
 * <ActionsFlowEditor bind:this={editorRef} {actions} {getActionDetail} />
 * <button onclick={() => editorRef.addActionNode('user.getById')}>Add Node</button>
 * ```
 */
export interface ActionsFlowEditorRef {
  // ============ 工作流方法 ============
  
  /** 获取当前工作流定义 */
  getWorkflow(): WorkflowDefinition;
  
  /**
   * 验证工作流（检查是否有未连接的必填输入）
   * @returns 验证结果，包含是否有效和错误列表
   */
  validateWorkflow(): { valid: boolean; errors: string[] };
  
  // ============ 节点方法 ============
  
  /** 获取所有节点 */
  getNodes(): Node<AllNodeData>[];
  
  /** 根据 ID 获取节点 */
  getNodeById(nodeId: string): Node<AllNodeData> | undefined;
  
  /** 根据类型获取节点 */
  getNodesByType(type: string): Node<AllNodeData>[];
  
  /**
   * 添加 Action 节点
   * @param actionName - Action 名称
   * @param position - 节点位置（可选）
   * @returns 新创建的节点，如果 Action 不存在则返回 null
   */
  addActionNode(actionName: string, position?: { x: number; y: number }): Promise<Node<ActionNodeData> | null>;
  
  /**
   * 添加 Util 节点
   * @param utilType - 工具类型
   * @param position - 节点位置（可选）
   * @returns 新创建的节点
   */
  addUtilNodeAt(utilType: UtilType, position?: { x: number; y: number }): Node<UtilNodeData>;
  
  /**
   * 添加赋值节点
   * @param position - 节点位置（可选）
   * @returns 新创建的节点
   */
  addAssignNodeAt(position?: { x: number; y: number }): Node<AssignNodeData>;
  
  /**
   * 添加条件节点 (If)
   * @param position - 节点位置（可选）
   * @returns 新创建的节点
   */
  addIfNodeAt(position?: { x: number; y: number }): Node<IfNodeData>;
  
  /**
   * 添加循环节点 (Loop)
   * @param position - 节点位置（可选）
   * @returns 新创建的节点
   */
  addLoopNodeAt(position?: { x: number; y: number }): Node<LoopNodeData>;
  
  /**
   * 删除节点
   * @param nodeId - 节点 ID
   * @returns 是否删除成功（开始节点和变量池节点不可删除）
   */
  removeNode(nodeId: string): boolean;
  
  /**
   * 更新节点位置
   * @param nodeId - 节点 ID
   * @param position - 新位置
   * @returns 是否更新成功
   */
  updateNodePosition(nodeId: string, position: { x: number; y: number }): boolean;
  
  /**
   * 更新节点数据
   * @param nodeId - 节点 ID
   * @param data - 要更新的数据
   * @returns 是否更新成功
   */
  updateNodeData(nodeId: string, data: Partial<AllNodeData>): boolean;
  
  // ============ 边方法 ============
  
  /** 获取所有边 */
  getEdges(): Edge[];
  
  /** 根据 ID 获取边 */
  getEdgeById(edgeId: string): Edge | undefined;
  
  /**
   * 获取连接到指定节点的所有边
   * @param nodeId - 节点 ID
   * @returns 入边和出边
   */
  getEdgesByNodeId(nodeId: string): { incoming: Edge[]; outgoing: Edge[] };
  
  /**
   * 连接两个节点
   * @param sourceNodeId - 源节点 ID
   * @param sourceHandle - 源节点输出引脚 ID (如 'output-result')
   * @param targetNodeId - 目标节点 ID
   * @param targetHandle - 目标节点输入引脚 ID (如 'input-data')
   * @returns 是否连接成功
   */
  connectNodes(
    sourceNodeId: string,
    sourceHandle: string,
    targetNodeId: string,
    targetHandle: string
  ): boolean;
  
  /**
   * 断开连接（删除边）
   * @param edgeId - 边 ID
   * @returns 是否删除成功
   */
  disconnectNodes(edgeId: string): boolean;
  
  /**
   * 断开指定节点的所有连接
   * @param nodeId - 节点 ID
   * @returns 删除的边数量
   */
  disconnectAllFromNode(nodeId: string): number;
  
  // ============ Action 方法 ============
  
  /** 获取所有可用的 Actions */
  getActions(): ActionSummary[];
  
  /** 根据名称获取 Action */
  getActionByName(name: string): ActionSummary | undefined;
  
  /**
   * 根据名称模糊搜索 Actions
   * @param keyword - 搜索关键词
   * @returns 匹配的 Actions
   */
  searchActions(keyword: string): ActionSummary[];
  
  // ============ 变量方法 ============
  
  /** 获取变量池中的所有变量 */
  getVariables(): VariableDefinition[];
  
  /**
   * 添加变量到变量池
   * @param variable - 变量定义
   * @returns 是否添加成功
   */
  addVariable(variable: VariableDefinition): boolean;
  
  /**
   * 删除变量
   * @param variableKey - 变量 key
   * @returns 是否删除成功
   */
  removeVariable(variableKey: string): boolean;
  
  // ============ 布局方法 ============
  
  /**
   * 应用自动布局
   * @param direction - 布局方向，默认 'LR'（从左到右）
   */
  applyLayout(direction?: LayoutDirection): void;
  
  // ============ 调试方法 ============
  
  /** 获取调试状态 */
  getDebugState(): DebugStateMap;
  
  /**
   * 获取节点的调试结果
   * @param nodeId - 节点 ID
   * @returns 调试结果
   */
  getNodeDebugResult(nodeId: string): NodeDebugResult | undefined;
  
  /** 清除所有调试状态 */
  clearDebugState(): void;
  
  /**
   * 清除指定节点的调试状态
   * @param nodeId - 节点 ID
   */
  clearNodeDebugState(nodeId: string): void;
  
  // ============ 其他方法 ============
  
  /** 获取 Start 节点的输入 Schema */
  getInputSchema(): Record<string, JsonSchemaProperty> | undefined;
}