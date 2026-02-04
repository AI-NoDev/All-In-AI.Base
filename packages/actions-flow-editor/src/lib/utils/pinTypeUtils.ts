import type { Node, Edge, Connection } from '@xyflow/svelte';
import {
  getDisplayType,
  getSchemaPropertyDisplayType,
  type SchemaProperty,
} from '../typeEngine.js';
import { isTypeCompatible } from '../edgeTypeRule.js';
import type {
  ActionNodeData,
  StartNodeData,
  UtilNodeData,
  VariablePoolNodeData,
  AssignNodeData,
  LoopStartNodeData,
  LoopNodeData,
  IfNodeData,
} from '../types.js';
import { UTIL_DEFINITIONS } from '../types.js';

type AllNodeData = Record<string, unknown>;

/**
 * 获取节点输出引脚的类型
 */
export function getOutputPinType(
  nodes: Node<AllNodeData>[],
  nodeId: string,
  handleId: string
): string | null {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  // 处理 internal-output- 和 output- 两种前缀
  let key = handleId;
  if (key.startsWith('internal-output-')) {
    key = key.replace('internal-output-', '');
  } else if (key.startsWith('output-')) {
    key = key.replace('output-', '');
  }

  if (node.type === 'start') {
    const startData = node.data as StartNodeData;
    const prop = startData.inputSchema[key];
    if (!prop) return null;
    return getDisplayType(prop as SchemaProperty);
  }

  if (node.type === 'action') {
    const actionData = node.data as ActionNodeData;
    return getSchemaPropertyDisplayType(actionData.action.outputSchema, key);
  }

  if (node.type === 'util') {
    const utilData = node.data as UtilNodeData;
    const utilDef = UTIL_DEFINITIONS[utilData.utilType];
    const output = utilDef.outputs.find((o) => o.key === key);
    return output?.type ?? null;
  }

  if (node.type === 'variablePool') {
    const poolData = node.data as VariablePoolNodeData;
    const variable = poolData.variables.find((v) => v.key === key);
    return variable?.type ?? null;
  }

  // 条件节点输出 (true/false 分支连接)
  if (node.type === 'condition') {
    if (key === 'true' || key === 'false') {
      return 'branch';
    }
    return null;
  }

  // 循环节点输出 (循环体连接) - 旧版兼容
  if (node.type === 'loop') {
    if (key === 'body') {
      return 'loopBody';
    }
    // 新版：内部输出引脚 (index, item, item.xxx)
    const loopData = node.data as LoopNodeData;
    if (key === 'index') {
      return 'number';
    }
    if (key === 'item') {
      return loopData.itemType || 'object';
    }
    // 处理展开的子路径（如 item.id, item.name）
    if (key.startsWith('item.') && loopData.itemSchema) {
      const subPath = key.slice(5);
      const parts = subPath.split('.');
      let currentSchema: SchemaProperty | undefined = loopData.itemSchema as SchemaProperty;

      for (const part of parts) {
        if (!currentSchema) return null;
        let props: Record<string, SchemaProperty> | undefined;
        if (currentSchema.properties) {
          props = currentSchema.properties as Record<string, SchemaProperty>;
        } else {
          const unionTypes = (currentSchema.anyOf ??
            currentSchema.oneOf) as SchemaProperty[] | undefined;
          if (unionTypes) {
            for (const item of unionTypes) {
              if (item.type === 'object' && item.properties) {
                props = item.properties as Record<string, SchemaProperty>;
                break;
              }
            }
          }
        }
        if (!props || !props[part]) return null;
        currentSchema = props[part];
      }

      if (currentSchema) {
        return getDisplayType(currentSchema);
      }
    }
    return null;
  }

  // 循环开始节点输出
  if (node.type === 'loopStart') {
    const startData = node.data as LoopStartNodeData;
    if (key === 'item') {
      return startData.outputType;
    }
    if (key === 'index') {
      return 'number';
    }
    // 处理展开的子路径（如 item.id, item.name）
    if (key.startsWith('item.') && startData.itemSchema) {
      const subPath = key.slice(5);
      const parts = subPath.split('.');
      let currentSchema: SchemaProperty | undefined = startData.itemSchema;

      for (const part of parts) {
        if (!currentSchema) return null;
        let props: Record<string, SchemaProperty> | undefined;
        if (currentSchema.properties) {
          props = currentSchema.properties as Record<string, SchemaProperty>;
        } else {
          const unionTypes = (currentSchema.anyOf ??
            currentSchema.oneOf) as SchemaProperty[] | undefined;
          if (unionTypes) {
            for (const item of unionTypes) {
              if (item.type === 'object' && item.properties) {
                props = item.properties as Record<string, SchemaProperty>;
                break;
              }
            }
          }
        }
        if (!props || !props[part]) return null;
        currentSchema = props[part];
      }

      if (currentSchema) {
        return getDisplayType(currentSchema);
      }
    }
    return null;
  }

  return null;
}

/**
 * 获取节点输出引脚的 Schema（用于循环节点类型推导）
 */
export function getOutputPinSchema(
  nodes: Node<AllNodeData>[],
  nodeId: string,
  handleId: string
): SchemaProperty | null {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  // 处理 internal-output- 和 output- 两种前缀
  let key = handleId;
  if (key.startsWith('internal-output-')) {
    key = key.replace('internal-output-', '');
  } else if (key.startsWith('output-')) {
    key = key.replace('output-', '');
  }

  if (node.type === 'start') {
    const startData = node.data as StartNodeData;
    const prop = startData.inputSchema[key];
    return prop ? (prop as SchemaProperty) : null;
  }

  if (node.type === 'action') {
    const actionData = node.data as ActionNodeData;
    const outputSchema = actionData.action.outputSchema;
    if (outputSchema.properties) {
      const props = outputSchema.properties as Record<string, SchemaProperty>;
      return props[key] ?? null;
    }
    const unionTypes = (outputSchema.anyOf ??
      outputSchema.oneOf) as SchemaProperty[] | undefined;
    if (unionTypes) {
      for (const item of unionTypes) {
        if (item.type === 'object' && item.properties) {
          const props = item.properties as Record<string, SchemaProperty>;
          if (props[key]) return props[key];
        }
      }
    }
    return null;
  }

  if (node.type === 'loopStart') {
    const startData = node.data as LoopStartNodeData;
    if (key === 'item') {
      return startData.itemSchema ?? null;
    }
    return null;
  }

  // 新版循环节点内部输出 schema
  if (node.type === 'loop') {
    const loopData = node.data as LoopNodeData;
    if (key === 'item') {
      return loopData.itemSchema ? (loopData.itemSchema as SchemaProperty) : null;
    }
    return null;
  }

  return null;
}

/**
 * 获取节点输入引脚的类型
 */
export function getInputPinType(
  nodes: Node<AllNodeData>[],
  nodeId: string,
  handleId: string
): string | null {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const key = handleId.replace('input-', '');

  if (node.type === 'action') {
    const actionData = node.data as ActionNodeData;
    const { query, params, body } = actionData.action.inputSchema;

    for (const schema of [query, params, body]) {
      const type = getSchemaPropertyDisplayType(schema, key);
      if (type) return type;
    }
    return null;
  }

  if (node.type === 'util') {
    const utilData = node.data as UtilNodeData;
    const utilDef = UTIL_DEFINITIONS[utilData.utilType];
    const input = utilDef.inputs.find((i) => i.key === key);
    if (!input) return null;

    if (utilData.utilType === 'toString' && input.configurable) {
      return utilData.config.inputType ?? 'string';
    }

    return input.type;
  }

  if (node.type === 'assign') {
    const assignData = node.data as AssignNodeData;
    if (key === 'value') {
      const selectedVar = assignData.availableVariables.find(
        (v) => v.key === assignData.targetVariableKey
      );
      return selectedVar?.type ?? 'string';
    }
    return null;
  }

  if (node.type === 'condition') {
    if (key === 'condition') {
      return 'boolean';
    }
    return null;
  }

  // 新版 if 节点
  if (node.type === 'if') {
    if (key === 'condition') {
      return 'boolean';
    }
    return null;
  }

  if (node.type === 'loop') {
    if (key === 'source') {
      return 'number|array';
    }
    return null;
  }

  if (node.type === 'conditionBranch') {
    if (key === 'branch') {
      return 'branch';
    }
    return null;
  }

  if (node.type === 'loopBody') {
    if (key === 'loop') {
      return 'loopBody';
    }
    return null;
  }

  return null;
}

/**
 * 获取节点所属的 SubFlow 容器 ID（loop、if、loopBody、conditionBranch）
 * 返回 null 表示节点在主流程中
 */
function getNodeSubflowContainer(
  nodeId: string,
  nodes: Node<AllNodeData>[]
): string | null {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  // 旧版：通过 parentId 关联
  if (node.parentId) {
    return node.parentId;
  }

  // 新版：检查是否在 loop 或 if 节点的 childNodeIds 中
  for (const n of nodes) {
    if (n.type === 'loop') {
      const loopData = n.data as LoopNodeData;
      if (loopData.childNodeIds.includes(nodeId)) {
        return n.id;
      }
    }
    if (n.type === 'if') {
      const ifData = n.data as IfNodeData;
      if (ifData.ifChildNodeIds.includes(nodeId) || ifData.elseChildNodeIds.includes(nodeId)) {
        return n.id;
      }
    }
  }

  return null;
}

/** 连接验证结果 */
export interface ConnectionValidationResult {
  valid: boolean;
  reason?: string;
  sourceType?: string | null;
  targetType?: string | null;
}

/**
 * 连接验证（返回详细结果）
 */
export function validateConnectionWithReason(
  connection: Edge | Connection,
  nodes: Node<AllNodeData>[],
  edges: Edge[]
): ConnectionValidationResult {
  // 不能自连接
  if (connection.source === connection.target) {
    return { valid: false, reason: '不能连接到自身' };
  }

  // 如果还没有目标节点或目标引脚，允许继续拖拽
  if (!connection.target || !connection.targetHandle) {
    return { valid: true };
  }

  // 输入引脚只能有一个连接
  const existingConnection = edges.find(
    (e) =>
      e.target === connection.target &&
      e.targetHandle === connection.targetHandle
  );
  if (existingConnection) {
    return { valid: false, reason: '该输入引脚已有连接' };
  }

  // SubFlow 边界检查：内部节点的输出不能连接到外部节点的输入
  const sourceContainer = getNodeSubflowContainer(connection.source ?? '', nodes);
  const targetContainer = getNodeSubflowContainer(connection.target ?? '', nodes);

  // 如果源节点在 SubFlow 内部，目标节点在外部或不同的 SubFlow 中，禁止连接
  if (sourceContainer !== null && sourceContainer !== targetContainer) {
    // 特殊情况：允许 loop/if 节点自身的内部输出引脚连接到外部
    // （internal-output- 前缀的引脚是容器节点暴露给外部的）
    const sourceHandle = connection.sourceHandle ?? '';
    if (!sourceHandle.startsWith('internal-output-')) {
      return { valid: false, reason: '循环/条件内部节点的输出不能连接到外部节点' };
    }
  }

  // 类型兼容性检查
  const sourceType = getOutputPinType(
    nodes,
    connection.source ?? '',
    connection.sourceHandle ?? ''
  );
  const targetType = getInputPinType(
    nodes,
    connection.target ?? '',
    connection.targetHandle ?? ''
  );

  // 如果无法获取类型信息，允许连接（可能是动态类型）
  if (!sourceType || !targetType) {
    return { valid: true, sourceType, targetType };
  }

  if (!isTypeCompatible(sourceType, targetType)) {
    return { 
      valid: false, 
      reason: `类型不兼容: ${sourceType} → ${targetType}`,
      sourceType,
      targetType,
    };
  }

  return { valid: true, sourceType, targetType };
}

/**
 * 连接验证（简单布尔返回，兼容旧接口）
 */
export function validateConnection(
  connection: Edge | Connection,
  nodes: Node<AllNodeData>[],
  edges: Edge[]
): boolean {
  return validateConnectionWithReason(connection, nodes, edges).valid;
}
