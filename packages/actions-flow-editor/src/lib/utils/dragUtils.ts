import type { Node } from '@xyflow/svelte';
import type { LoopNodeData, IfNodeData } from '../types.js';
import { sortNodesForParentChild, updateSubflowChildNodeIds, type SubflowType } from './nodeUtils.js';

type AllNodeData = Record<string, unknown>;

/** SubFlow 检测结果 */
export interface SubflowDetectionResult {
  targetSubflow: Node<AllNodeData> | null;
  subflowType?: SubflowType;
  absolutePosition: { x: number; y: number };
}

/**
 * 检测节点是否在某个 SubFlow 内
 * 支持内嵌 SubFlow 节点 (loop, if)
 */
export function detectTargetSubflow(
  draggedNode: Node<AllNodeData>,
  nodes: Node<AllNodeData>[]
): SubflowDetectionResult {
  const nodeWidth = draggedNode.measured?.width ?? 200;
  const nodeHeight = draggedNode.measured?.height ?? 100;
  const nodeX = draggedNode.position.x;
  const nodeY = draggedNode.position.y;

  // 如果节点已经在某个 SubFlow 内，计算其绝对位置
  let absoluteX = nodeX;
  let absoluteY = nodeY;
  if (draggedNode.parentId) {
    const parentNode = nodes.find((n) => n.id === draggedNode.parentId);
    if (parentNode) {
      absoluteX += parentNode.position.x;
      absoluteY += parentNode.position.y;
    }
  }

  // 检测节点中心点
  const nodeCenterX = absoluteX + nodeWidth / 2;
  const nodeCenterY = absoluteY + nodeHeight / 2;

  let targetSubflow: Node<AllNodeData> | null = null;
  let subflowType: SubflowDetectionResult['subflowType'] = undefined;

  // 检测内嵌 SubFlow 节点 (loop, if)
  const embeddedSubflowNodes = nodes.filter(
    (n) => n.type === 'loop' || n.type === 'if'
  );

  for (const container of embeddedSubflowNodes) {
    const containerWidth = container.measured?.width ?? 320;
    const containerHeight = container.measured?.height ?? 300;
    const containerX = container.position.x;
    const containerY = container.position.y;

    if (container.type === 'loop') {
      // Loop 节点: header(40) + 内部引脚区域 + SubFlow 区域
      const HEADER_HEIGHT = 40;
      // 估算内部引脚区域高度
      const INTERNAL_PINS_HEADER = 28;
      const INTERNAL_PIN_HEIGHT = 24;
      const pinCount = 2; // index + item (简化估算)
      const internalPinsHeight = INTERNAL_PINS_HEADER + pinCount * INTERNAL_PIN_HEIGHT + 8;
      const subflowTop = containerY + HEADER_HEIGHT + internalPinsHeight;
      const PADDING = 16;

      // 检查是否在 SubFlow 区域内
      if (
        nodeCenterX >= containerX + PADDING / 2 &&
        nodeCenterX <= containerX + containerWidth - PADDING / 2 &&
        nodeCenterY >= subflowTop &&
        nodeCenterY <= containerY + containerHeight - PADDING / 2
      ) {
        targetSubflow = container;
        subflowType = 'loop';
        break;
      }
    } else if (container.type === 'if') {
      // If 节点: header(40) + if SubFlow + (可选) else SubFlow
      const HEADER_HEIGHT = 40;
      const PADDING = 16;
      const data = container.data as IfNodeData;
      
      const subflowAreaTop = containerY + HEADER_HEIGHT + PADDING / 2;
      const subflowAreaBottom = containerY + containerHeight - PADDING / 2;
      const subflowAreaLeft = containerX + PADDING / 2;
      const subflowAreaRight = containerX + containerWidth - PADDING / 2;

      // 检查是否在 SubFlow 区域内
      if (
        nodeCenterX >= subflowAreaLeft &&
        nodeCenterX <= subflowAreaRight &&
        nodeCenterY >= subflowAreaTop &&
        nodeCenterY <= subflowAreaBottom
      ) {
        targetSubflow = container;
        
        // 判断是 if 还是 else 区域
        if (data.hasElse) {
          const midY = (subflowAreaTop + subflowAreaBottom) / 2;
          subflowType = nodeCenterY < midY ? 'if-true' : 'if-false';
        } else {
          subflowType = 'if-true';
        }
        break;
      }
    }
  }

  return {
    targetSubflow,
    subflowType,
    absolutePosition: { x: absoluteX, y: absoluteY },
  };
}

/**
 * 处理节点拖入 SubFlow
 */
export function moveNodeIntoSubflow<T extends AllNodeData>(
  nodes: Node<T>[],
  draggedNodeId: string,
  targetSubflowId: string,
  absolutePosition: { x: number; y: number },
  subflowType?: SubflowType
): Node<T>[] {
  const targetSubflow = nodes.find((n) => n.id === targetSubflowId);
  if (!targetSubflow) return nodes;

  const relativeX = absolutePosition.x - targetSubflow.position.x;
  const relativeY = absolutePosition.y - targetSubflow.position.y;

  const updatedNodes = nodes.map((n) => {
    if (n.id === draggedNodeId) {
      return {
        ...n,
        position: { x: relativeX, y: relativeY },
        parentId: targetSubflowId,
        extent: 'parent' as const,
      };
    }
    if (n.id === targetSubflowId) {
      return updateSubflowChildNodeIds(n, draggedNodeId, 'add', subflowType);
    }
    return n;
  });

  return sortNodesForParentChild(updatedNodes);
}

/**
 * 处理节点拖出 SubFlow
 */
export function moveNodeOutOfSubflow<T extends AllNodeData>(
  nodes: Node<T>[],
  draggedNodeId: string,
  currentParentId: string,
  absolutePosition: { x: number; y: number },
  currentSubflowType?: SubflowType
): Node<T>[] {
  const updatedNodes = nodes.map((n) => {
    if (n.id === draggedNodeId) {
      const { parentId: _, extent: __, ...rest } = n;
      return {
        ...rest,
        position: absolutePosition,
      } as Node<T>;
    }
    if (n.id === currentParentId) {
      return updateSubflowChildNodeIds(n, draggedNodeId, 'remove', currentSubflowType);
    }
    return n;
  });

  return sortNodesForParentChild(updatedNodes);
}

/**
 * 处理节点在 SubFlow 之间移动
 */
export function moveNodeBetweenSubflows<T extends AllNodeData>(
  nodes: Node<T>[],
  draggedNodeId: string,
  currentParentId: string,
  targetSubflowId: string,
  absolutePosition: { x: number; y: number },
  currentSubflowType?: SubflowType,
  targetSubflowType?: SubflowType
): Node<T>[] {
  const targetSubflow = nodes.find((n) => n.id === targetSubflowId);
  if (!targetSubflow) return nodes;

  const relativeX = absolutePosition.x - targetSubflow.position.x;
  const relativeY = absolutePosition.y - targetSubflow.position.y;

  const updatedNodes = nodes.map((n) => {
    if (n.id === draggedNodeId) {
      return {
        ...n,
        position: { x: relativeX, y: relativeY },
        parentId: targetSubflowId,
        extent: 'parent' as const,
      };
    }
    if (n.id === currentParentId) {
      return updateSubflowChildNodeIds(n, draggedNodeId, 'remove', currentSubflowType);
    }
    if (n.id === targetSubflowId) {
      return updateSubflowChildNodeIds(n, draggedNodeId, 'add', targetSubflowType);
    }
    return n;
  });

  return sortNodesForParentChild(updatedNodes);
}

/** 拖拽操作类型 */
export type DragOperation =
  | { type: 'none' }
  | { type: 'into-subflow'; targetSubflowId: string; absolutePosition: { x: number; y: number }; targetSubflowType?: SubflowType }
  | { type: 'out-of-subflow'; currentParentId: string; absolutePosition: { x: number; y: number }; currentSubflowType?: SubflowType }
  | { type: 'between-subflows'; currentParentId: string; targetSubflowId: string; absolutePosition: { x: number; y: number }; currentSubflowType?: SubflowType; targetSubflowType?: SubflowType };

/**
 * 根据节点当前父节点确定其 SubflowType
 */
function getSubflowTypeForNode(
  node: Node<AllNodeData>,
  parentNode: Node<AllNodeData> | undefined
): SubflowType | undefined {
  if (!parentNode) return undefined;
  
  if (parentNode.type === 'loop') return 'loop';
  
  if (parentNode.type === 'if') {
    // 需要判断节点在 if 还是 else 区域
    const data = parentNode.data as IfNodeData;
    if (data.ifChildNodeIds.includes(node.id)) return 'if-true';
    if (data.elseChildNodeIds.includes(node.id)) return 'if-false';
    return 'if-true'; // 默认
  }
  
  return undefined;
}

/**
 * 确定拖拽操作类型
 */
export function determineDragOperation(
  draggedNode: Node<AllNodeData>,
  nodes: Node<AllNodeData>[]
): DragOperation {
  // 不处理 SubFlow 容器节点本身（loop 和 if 节点）
  if (
    draggedNode.type === 'loop' ||
    draggedNode.type === 'if'
  ) {
    return { type: 'none' };
  }

  const { targetSubflow, subflowType: targetSubflowType, absolutePosition } = detectTargetSubflow(draggedNode, nodes);
  const currentParentId = draggedNode.parentId;
  
  // 获取当前父节点以确定 currentSubflowType
  const currentParentNode = currentParentId ? nodes.find((n) => n.id === currentParentId) : undefined;
  const currentSubflowType = getSubflowTypeForNode(draggedNode, currentParentNode);

  // 情况1: 节点从主流程拖入 SubFlow
  if (!currentParentId && targetSubflow) {
    return {
      type: 'into-subflow',
      targetSubflowId: targetSubflow.id,
      absolutePosition,
      targetSubflowType,
    };
  }

  // 情况2: 节点从 SubFlow 拖出到主流程
  if (currentParentId && !targetSubflow) {
    return {
      type: 'out-of-subflow',
      currentParentId,
      absolutePosition,
      currentSubflowType,
    };
  }

  // 情况3: 节点从一个 SubFlow 拖到另一个 SubFlow
  if (currentParentId && targetSubflow && currentParentId !== targetSubflow.id) {
    return {
      type: 'between-subflows',
      currentParentId,
      targetSubflowId: targetSubflow.id,
      absolutePosition,
      currentSubflowType,
      targetSubflowType,
    };
  }

  return { type: 'none' };
}
