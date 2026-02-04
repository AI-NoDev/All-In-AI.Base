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
  ConditionNodeData,
  LoopNodeData,
  LoopBodyNodeData,
  LoopStartNodeData,
  ConditionBranchNodeData,
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

/** 条件节点创建结果 */
export interface ConditionNodeResult {
  conditionNode: Node<ConditionNodeData>;
  trueBranchNode: Node<ConditionBranchNodeData>;
  falseBranchNode: Node<ConditionBranchNodeData>;
  edges: Edge[];
}

/** 创建条件节点（带两个分支 SubFlow） */
export function createConditionNode(
  position: { x: number; y: number },
  onDelete: NodeDeleteHandler
): ConditionNodeResult {
  const conditionId = generateId();
  const trueBranchId = generateId();
  const falseBranchId = generateId();

  const conditionNode: Node<ConditionNodeData> = {
    id: conditionId,
    type: 'condition',
    position,
    data: {
      inputMappings: {},
      trueBranchId,
      falseBranchId,
      onDelete,
    },
  };

  const trueBranchNode: Node<ConditionBranchNodeData> = {
    id: trueBranchId,
    type: 'conditionBranch',
    position: { x: position.x + 250, y: position.y - 50 },
    style: 'width: 300px; height: 200px;',
    data: {
      branchType: 'true',
      parentConditionId: conditionId,
      childNodeIds: [],
      onDelete,
    },
  };

  const falseBranchNode: Node<ConditionBranchNodeData> = {
    id: falseBranchId,
    type: 'conditionBranch',
    position: { x: position.x + 250, y: position.y + 180 },
    style: 'width: 300px; height: 200px;',
    data: {
      branchType: 'false',
      parentConditionId: conditionId,
      childNodeIds: [],
      onDelete,
    },
  };

  const edges: Edge[] = [
    {
      id: `edge_${conditionId}_true_${trueBranchId}`,
      source: conditionId,
      sourceHandle: 'output-true',
      target: trueBranchId,
      targetHandle: 'input-branch',
      type: 'default',
    },
    {
      id: `edge_${conditionId}_false_${falseBranchId}`,
      source: conditionId,
      sourceHandle: 'output-false',
      target: falseBranchId,
      targetHandle: 'input-branch',
      type: 'default',
    },
  ];

  return { conditionNode, trueBranchNode, falseBranchNode, edges };
}

/** 循环节点创建结果 */
export interface LoopNodeResult {
  loopNode: Node<LoopNodeData>;
  loopBodyNode: Node<LoopBodyNodeData>;
  loopStartNode: Node<LoopStartNodeData>;
  edge: Edge;
}

/** 创建循环节点（带循环体 SubFlow 和循环开始节点） */
export function createLoopNode(
  position: { x: number; y: number },
  onDelete: NodeDeleteHandler
): LoopNodeResult {
  const loopId = generateId();
  const loopBodyId = generateId();
  const loopStartId = generateId();

  const loopNode: Node<LoopNodeData> = {
    id: loopId,
    type: 'loop',
    position,
    data: {
      inputType: 'number|array',
      itemType: 'object',
      inputMappings: {},
      childNodeIds: [],
      subflowSize: { width: 300, height: 150 },
      loopBodyId,
      onDelete,
    },
  };

  const loopBodyNode: Node<LoopBodyNodeData> = {
    id: loopBodyId,
    type: 'loopBody',
    position: { x: position.x + 250, y: position.y - 20 },
    style: 'width: 350px; height: 250px;',
    data: {
      parentLoopId: loopId,
      itemType: 'object',
      childNodeIds: [loopStartId],
      onDelete,
    },
  };

  const loopStartNode: Node<LoopStartNodeData> = {
    id: loopStartId,
    type: 'loopStart',
    position: { x: 20, y: 50 },
    parentId: loopBodyId,
    extent: 'parent',
    data: {
      outputType: 'object',
      indexType: 'number',
      onDelete,
    },
  };

  const edge: Edge = {
    id: `edge_${loopId}_body_${loopBodyId}`,
    source: loopId,
    sourceHandle: 'output-body',
    target: loopBodyId,
    targetHandle: 'input-loop',
    type: 'default',
  };

  return { loopNode, loopBodyNode, loopStartNode, edge };
}

/** 创建条件分支节点（用于自动创建） */
export function createConditionBranchNode(
  position: { x: number; y: number },
  branchType: 'true' | 'false',
  parentConditionId: string,
  onDelete: NodeDeleteHandler
): { node: Node<ConditionBranchNodeData>; edge: Edge } {
  const branchId = generateId();

  const node: Node<ConditionBranchNodeData> = {
    id: branchId,
    type: 'conditionBranch',
    position,
    style: 'width: 300px; height: 200px;',
    data: {
      branchType,
      parentConditionId,
      childNodeIds: [],
      onDelete,
    },
  };

  const edge: Edge = {
    id: `edge_${parentConditionId}_output-${branchType}_${branchId}`,
    source: parentConditionId,
    sourceHandle: `output-${branchType}`,
    target: branchId,
    targetHandle: 'input-branch',
    type: 'default',
  };

  return { node, edge };
}

/** 创建循环体节点（用于自动创建） */
export function createLoopBodyWithStart(
  position: { x: number; y: number },
  parentLoopId: string,
  itemType: string,
  onDelete: NodeDeleteHandler
): { loopBodyNode: Node<LoopBodyNodeData>; loopStartNode: Node<LoopStartNodeData>; edge: Edge } {
  const loopBodyId = generateId();
  const loopStartId = generateId();

  const loopBodyNode: Node<LoopBodyNodeData> = {
    id: loopBodyId,
    type: 'loopBody',
    position,
    style: 'width: 350px; height: 250px;',
    data: {
      parentLoopId,
      itemType,
      childNodeIds: [loopStartId],
      onDelete,
    },
  };

  const loopStartNode: Node<LoopStartNodeData> = {
    id: loopStartId,
    type: 'loopStart',
    position: { x: 20, y: 50 },
    parentId: loopBodyId,
    extent: 'parent',
    data: {
      outputType: itemType,
      indexType: 'number',
      onDelete,
    },
  };

  const edge: Edge = {
    id: `edge_${parentLoopId}_body_${loopBodyId}`,
    source: parentLoopId,
    sourceHandle: 'output-body',
    target: loopBodyId,
    targetHandle: 'input-loop',
    type: 'default',
  };

  return { loopBodyNode, loopStartNode, edge };
}


// ============ 新版节点工厂函数 ============

/** 新版循环节点创建结果 */
export interface NewLoopNodeResult {
  loopNode: Node<LoopNodeData>;
}

/** 创建新版循环节点（内嵌 SubFlow） */
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
