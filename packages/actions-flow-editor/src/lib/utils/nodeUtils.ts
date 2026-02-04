import type { Node, Edge } from '@xyflow/svelte';
import type {
  ConditionNodeData,
  LoopBodyNodeData,
  ConditionBranchNodeData,
  LoopNodeData,
  IfNodeData,
} from '../types.js';

/** 所有节点数据类型的联合类型 */
export type AllNodeData = Record<string, unknown>;

/** SubFlow 类型，用于确定更新哪个 childNodeIds 数组 */
export type SubflowType = 'loop' | 'if-true' | 'if-false' | 'loopBody' | 'conditionBranch';

/**
 * 生成唯一节点 ID
 */
export function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 确保节点数组顺序正确：父节点必须在子节点之前
 * SvelteFlow 要求 parentId 引用的节点必须在数组中先出现
 */
export function sortNodesForParentChild<T extends AllNodeData>(
  nodeList: Node<T>[]
): Node<T>[] {
  const parentNodes: Node<T>[] = [];
  const childNodes: Node<T>[] = [];

  for (const node of nodeList) {
    if (node.parentId) {
      childNodes.push(node);
    } else {
      parentNodes.push(node);
    }
  }

  return [...parentNodes, ...childNodes];
}

/**
 * 收集需要级联删除的节点 ID（递归）
 */
export function collectCascadeDeleteIds(
  nodeId: string,
  nodes: Node<AllNodeData>[],
  edges: Edge[],
  collected: Set<string>
): void {
  if (collected.has(nodeId)) return;
  collected.add(nodeId);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;

  // 新的 loop 节点（内嵌 SubFlow）：删除所有子节点
  if (node.type === 'loop') {
    const loopData = node.data as LoopNodeData;
    for (const childId of loopData.childNodeIds) {
      collectCascadeDeleteIds(childId, nodes, edges, collected);
    }
    // 兼容旧版：也检查 output-body 连接
    for (const e of edges) {
      if (e.source === nodeId && e.sourceHandle === 'output-body') {
        collectCascadeDeleteIds(e.target, nodes, edges, collected);
      }
    }
  }

  // 新的 if 节点（内嵌 SubFlow）：删除 if 和 else 分支的所有子节点
  if (node.type === 'if') {
    const ifData = node.data as IfNodeData;
    for (const childId of ifData.ifChildNodeIds) {
      collectCascadeDeleteIds(childId, nodes, edges, collected);
    }
    for (const childId of ifData.elseChildNodeIds) {
      collectCascadeDeleteIds(childId, nodes, edges, collected);
    }
  }

  // 旧的循环体节点：删除所有子节点（parentId 指向此节点的）
  if (node.type === 'loopBody') {
    for (const n of nodes) {
      if (n.parentId === nodeId) {
        collectCascadeDeleteIds(n.id, nodes, edges, collected);
      }
    }
  }

  // 旧的条件节点：删除两个分支
  if (node.type === 'condition') {
    const condData = node.data as ConditionNodeData;
    if (condData.trueBranchId) {
      collectCascadeDeleteIds(condData.trueBranchId, nodes, edges, collected);
    }
    if (condData.falseBranchId) {
      collectCascadeDeleteIds(condData.falseBranchId, nodes, edges, collected);
    }
  }

  // 旧的条件分支节点：删除所有子节点（parentId 指向此节点的）
  if (node.type === 'conditionBranch') {
    for (const n of nodes) {
      if (n.parentId === nodeId) {
        collectCascadeDeleteIds(n.id, nodes, edges, collected);
      }
    }
  }
}

/**
 * 更新 SubFlow 的 childNodeIds
 * @param node - SubFlow 容器节点
 * @param childId - 要添加/移除的子节点 ID
 * @param action - 'add' 或 'remove'
 * @param subflowType - SubFlow 类型，用于 if 节点区分 if/else 分支
 */
export function updateSubflowChildNodeIds<T extends AllNodeData>(
  node: Node<T>,
  childId: string,
  action: 'add' | 'remove',
  subflowType?: SubflowType
): Node<T> {
  // 新的 loop 节点
  if (node.type === 'loop') {
    const data = node.data as unknown as LoopNodeData;
    const childNodeIds =
      action === 'add'
        ? [...data.childNodeIds, childId]
        : data.childNodeIds.filter((id) => id !== childId);
    return {
      ...node,
      data: { ...data, childNodeIds } as unknown as T,
    };
  }

  // 新的 if 节点
  if (node.type === 'if') {
    const data = node.data as unknown as IfNodeData;
    
    // 根据 subflowType 决定更新哪个数组
    if (subflowType === 'if-false') {
      const elseChildNodeIds =
        action === 'add'
          ? [...data.elseChildNodeIds, childId]
          : data.elseChildNodeIds.filter((id) => id !== childId);
      return {
        ...node,
        data: { ...data, elseChildNodeIds } as unknown as T,
      };
    } else {
      // 默认更新 if 分支
      const ifChildNodeIds =
        action === 'add'
          ? [...data.ifChildNodeIds, childId]
          : data.ifChildNodeIds.filter((id) => id !== childId);
      return {
        ...node,
        data: { ...data, ifChildNodeIds } as unknown as T,
      };
    }
  }

  // 旧的 loopBody 节点（兼容）
  if (node.type === 'loopBody') {
    const data = node.data as unknown as LoopBodyNodeData;
    const childNodeIds =
      action === 'add'
        ? [...data.childNodeIds, childId]
        : data.childNodeIds.filter((id) => id !== childId);
    return {
      ...node,
      data: { ...data, childNodeIds } as unknown as T,
    };
  }

  // 旧的 conditionBranch 节点（兼容）
  if (node.type === 'conditionBranch') {
    const data = node.data as unknown as ConditionBranchNodeData;
    const childNodeIds =
      action === 'add'
        ? [...data.childNodeIds, childId]
        : data.childNodeIds.filter((id) => id !== childId);
    return {
      ...node,
      data: { ...data, childNodeIds } as unknown as T,
    };
  }

  return node;
}
