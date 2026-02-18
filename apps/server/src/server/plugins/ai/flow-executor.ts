/**
 * Flow Executor - 工作流执行器
 */

import type {
  WorkflowDefinition,
  FlowNode,
  FlowEdge,
  FlowExecutorConfig,
  FlowExecutionResult,
  UtilType,
} from './types';

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

export class FlowExecutor {
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
