import type { Node, Edge } from '@xyflow/svelte';
import type {
  ActionDetail,
  ActionNodeData,
  StartNodeData,
  UtilNodeData,
  UtilType,
  VariablePoolNodeData,
  VariableDefinition,
  AssignNodeData,
  LoopNodeData,
  IfNodeData,
  JsonSchemaProperty,
} from '../types.js';
import { generateId } from './nodeUtils.js';

/** 节点删除回调类型 */
export type NodeDeleteHandler = (nodeId: string) => void;

/** Util 配置变更回调类型 */
export type UtilConfigChangeHandler = (
  nodeId: string,
  config: UtilNodeData['config']
) => void;

/** 变量变更回调类型 */
export type VariablesChangeHandler = (
  nodeId: string,
  variables: VariableDefinition[]
) => void;

/** 赋值目标变更回调类型 */
export type AssignTargetChangeHandler = (
  nodeId: string,
  targetKey: string
) => void;

/** 创建 Action 节点 */
export function createActionNode(
  detail: ActionDetail,
  position: { x: number; y: number },
  onDelete: NodeDeleteHandler
): Node<ActionNodeData> {
  return {
    id: generateId(),
    type: 'action',
    position,
    data: {
      action: detail,
      inputMappings: {},
      onDelete,
    },
  };
}

/** 创建 Start 节点 */
export function createStartNode(
  onDelete?: NodeDeleteHandler,
  inputSchema?: Record<string, JsonSchemaProperty>
): Node<StartNodeData> {
  return {
    id: 'start',
    type: 'start',
    position: { x: 50, y: 80 },
    data: {
      inputSchema: inputSchema ?? {},
      onDelete,
    },
  };
}

/** 创建 Util 节点 */
export function createUtilNode(
  utilType: UtilType,
  position: { x: number; y: number },
  onConfigChange: UtilConfigChangeHandler,
  onDelete: NodeDeleteHandler
): Node<UtilNodeData> {
  return {
    id: generateId(),
    type: 'util',
    position,
    data: {
      utilType,
      config: {
        inputType: 'string',
        checkType: 'string',
      },
      inputMappings: {},
      onConfigChange,
      onDelete,
    },
  };
}

/** 创建变量池节点 */
export function createVariablePoolNode(
  onVariablesChange: VariablesChangeHandler,
  onDelete?: NodeDeleteHandler
): Node<VariablePoolNodeData> {
  return {
    id: 'variablePool',
    type: 'variablePool',
    position: { x: 50, y: 300 },
    data: {
      variables: [],
      onVariablesChange,
      onDelete,
    },
  };
}

/** 创建赋值节点 */
export function createAssignNode(
  position: { x: number; y: number },
  availableVariables: VariableDefinition[],
  onTargetChange: AssignTargetChangeHandler,
  onDelete: NodeDeleteHandler
): Node<AssignNodeData> {
  return {
    id: generateId(),
    type: 'assign',
    position,
    data: {
      targetVariableKey: '',
      inputMappings: {},
      availableVariables,
      onTargetChange,
      onDelete,
    },
  };
}


// ============ 节点工厂函数 ============

/** 循环节点创建结果 */
export interface NewLoopNodeResult {
  loopNode: Node<LoopNodeData>;
}

/** 创建循环节点（内嵌 SubFlow） */
export function createNewLoopNode(
  position: { x: number; y: number },
  onDelete: NodeDeleteHandler
): NewLoopNodeResult {
  const loopId = generateId();

  const loopNode: Node<LoopNodeData> = {
    id: loopId,
    type: 'loop',
    position,
    style: 'width: 920px; height: 550px;',
    data: {
      inputType: 'number|array',
      itemType: 'object',
      inputMappings: {},
      childNodeIds: [],
      subflowSize: { width: 900, height: 450 },
      onDelete,
    },
  };

  return { loopNode };
}

/** If 节点 else 开关回调类型 */
export type ElseToggleHandler = (nodeId: string, hasElse: boolean) => void;

/** If 节点尺寸变更回调类型 */
export type IfSizeChangeHandler = (
  nodeId: string,
  ifSize: { width: number; height: number },
  elseSize?: { width: number; height: number }
) => void;

/** 新版条件节点创建结果 */
export interface NewIfNodeResult {
  ifNode: Node<IfNodeData>;
}

/** 创建新版条件节点（内嵌 if/else SubFlow） */
export function createNewIfNode(
  position: { x: number; y: number },
  onDelete: NodeDeleteHandler,
  onElseToggle?: ElseToggleHandler
): NewIfNodeResult {
  const ifId = generateId();

  const ifNode: Node<IfNodeData> = {
    id: ifId,
    type: 'if',
    position,
    style: 'width: 880px; height: 480px;',
    data: {
      inputMappings: {},
      hasElse: false,
      ifChildNodeIds: [],
      elseChildNodeIds: [],
      ifSubflowSize: { width: 840, height: 360 },
      elseSubflowSize: { width: 840, height: 360 },
      onDelete,
      onElseToggle,
    },
  };

  return { ifNode };
}
