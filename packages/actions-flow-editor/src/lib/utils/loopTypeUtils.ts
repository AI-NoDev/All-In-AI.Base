import type { Node } from '@xyflow/svelte';
import { parseArrayType, type SchemaProperty } from '../typeEngine.js';
import type { LoopNodeData, LoopBodyNodeData, LoopStartNodeData } from '../types.js';

type AllNodeData = Record<string, unknown>;

/** 循环类型计算结果 */
export interface LoopTypeInfo {
  itemType: string;
  itemSchema?: SchemaProperty;
}

/**
 * 根据输入类型计算循环项类型
 */
export function calculateLoopItemType(
  inputType: string,
  sourceSchema: SchemaProperty | null
): LoopTypeInfo {
  let itemType = 'object';
  let itemSchema: SchemaProperty | undefined = undefined;

  if (inputType === 'number') {
    itemType = 'number';
  } else {
    const inner = parseArrayType(inputType);
    if (inner) {
      itemType = inner;
      // 从源 Schema 的 items 中获取数组项的 Schema
      if (sourceSchema?.items) {
        itemSchema = sourceSchema.items as SchemaProperty;
      } else if (sourceSchema?.anyOf || sourceSchema?.oneOf) {
        // 处理 anyOf/oneOf 中的 array 类型
        const unionTypes = (sourceSchema.anyOf ??
          sourceSchema.oneOf) as SchemaProperty[];
        for (const item of unionTypes) {
          if (item.type === 'array' && item.items) {
            itemSchema = item.items as SchemaProperty;
            break;
          }
        }
      }
    }
  }

  return { itemType, itemSchema };
}

/**
 * 更新循环节点及其相关节点的类型
 */
export function updateLoopNodesType<T extends AllNodeData>(
  nodes: Node<T>[],
  loopNodeId: string,
  inputType: string,
  loopTypeInfo: LoopTypeInfo
): Node<T>[] {
  const { itemType, itemSchema } = loopTypeInfo;

  // 先找出所有属于这个循环节点的循环体 ID
  const loopBodyIds = new Set<string>();
  for (const n of nodes) {
    if (n.type === 'loopBody') {
      const bodyData = n.data as unknown as LoopBodyNodeData;
      if (bodyData.parentLoopId === loopNodeId) {
        loopBodyIds.add(n.id);
      }
    }
  }

  return nodes.map((n) => {
    // 更新循环节点
    if (n.id === loopNodeId && n.type === 'loop') {
      const loopData = n.data as unknown as LoopNodeData;
      return { ...n, data: { ...loopData, inputType } as unknown as T };
    }
    // 更新循环体节点
    if (n.type === 'loopBody' && loopBodyIds.has(n.id)) {
      const bodyData = n.data as unknown as LoopBodyNodeData;
      return { ...n, data: { ...bodyData, itemType } as unknown as T };
    }
    // 更新循环开始节点（通过 parentId 直接判断）
    if (n.type === 'loopStart' && n.parentId && loopBodyIds.has(n.parentId)) {
      const startData = n.data as unknown as LoopStartNodeData;
      return {
        ...n,
        data: { ...startData, outputType: itemType, itemSchema } as unknown as T,
      };
    }
    return n;
  });
}
