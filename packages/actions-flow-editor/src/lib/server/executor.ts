/**
 * Actions Flow Editor - Flow Executor
 * 
 * 流程执行引擎，用于在服务端运行 Actions Flow
 */

import type {
  WorkflowDefinition,
  FlowNode,
  FlowEdge,
  ActionNodeData,
  UtilNodeData,
  AssignNodeData,
  IfNodeData,
  LoopNodeData,
  VariablePoolNodeData,
} from '../types.js';

import type {
  ActionContext,
  FlowExecutorConfig,
  FlowExecutionResult,
  NodeExecutionResult,
  GetActionByName,
} from './types.js';

import { executeUtil } from './utils.js';

/**
 * 流程执行器
 */
export class FlowExecutor {
  private workflow: WorkflowDefinition;
  private config: FlowExecutorConfig;
  private nodeOutputs: Map<string, Record<string, unknown>> = new Map();
  private nodeResults: Map<string, NodeExecutionResult> = new Map();
  private variables: Map<string, unknown> = new Map();
  private nodesMap: Map<string, FlowNode> = new Map();
  private edgesMap: Map<string, FlowEdge[]> = new Map(); // nodeId -> outgoing edges

  constructor(workflow: WorkflowDefinition, config: FlowExecutorConfig) {
    this.workflow = workflow;
    this.config = {
      maxLoopIterations: 1000,
      nodeTimeout: 30000,
      ...config,
    };
    
    // 构建节点和边的索引
    for (const node of workflow.nodes) {
      this.nodesMap.set(node.id, node);
    }
    for (const edge of workflow.edges) {
      const edges = this.edgesMap.get(edge.source) || [];
      edges.push(edge);
      this.edgesMap.set(edge.source, edges);
    }
  }

  /**
   * 执行流程
   * @param input - 流程输入参数
   */
  async execute(input: Record<string, unknown>): Promise<FlowExecutionResult> {
    try {
      // 找到 start 节点
      const startNode = this.workflow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        return { success: false, error: 'No start node found' };
      }

      // 初始化变量池
      const variablePoolNode = this.workflow.nodes.find(n => n.type === 'variablePool');
      if (variablePoolNode) {
        const data = variablePoolNode.data as VariablePoolNodeData;
        for (const v of data.variables || []) {
          this.variables.set(v.key, v.defaultValue);
        }
      }

      // 设置 start 节点的输出
      this.nodeOutputs.set(startNode.id, input);

      // 从 start 节点开始执行
      await this.executeFromNode(startNode.id);

      // 获取最终输出（最后一个执行的节点的输出）
      const lastResult = Array.from(this.nodeResults.values()).pop();
      
      return {
        success: true,
        output: lastResult?.output,
        nodeResults: this.nodeResults,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        nodeResults: this.nodeResults,
      };
    }
  }

  /**
   * 从指定节点开始执行
   */
  private async executeFromNode(nodeId: string): Promise<void> {
    const node = this.nodesMap.get(nodeId);
    if (!node) return;

    // 执行当前节点
    await this.executeNode(node);

    // 获取下游节点并执行
    const outgoingEdges = this.edgesMap.get(nodeId) || [];
    const nextNodeIds = new Set<string>();
    
    for (const edge of outgoingEdges) {
      // 只处理执行流边（exec 类型）
      if (edge.sourceHandle?.startsWith('exec-') || edge.sourceHandle === 'exec') {
        nextNodeIds.add(edge.target);
      }
    }

    for (const nextNodeId of nextNodeIds) {
      await this.executeFromNode(nextNodeId);
    }
  }

  /**
   * 执行单个节点
   */
  private async executeNode(node: FlowNode): Promise<void> {
    const startTime = Date.now();
    let output: unknown;
    let error: string | undefined;
    const nodeType = node.type as string;

    try {
      // 收集输入
      const inputs = this.collectInputs(node);

      switch (node.type) {
        case 'start':
          // Start 节点的输出已经在 execute() 中设置
          output = this.nodeOutputs.get(node.id);
          break;

        case 'variablePool':
          // 变量池节点不执行，只提供变量
          output = Object.fromEntries(this.variables);
          break;

        case 'action':
          output = await this.executeActionNode(node, inputs);
          break;

        case 'util':
          output = this.executeUtilNode(node, inputs);
          break;

        case 'assign':
          output = this.executeAssignNode(node, inputs);
          break;

        case 'if':
          output = await this.executeIfNode(node, inputs);
          break;

        case 'loop':
          output = await this.executeLoopNode(node, inputs);
          break;

        default:
          throw new Error(`Unknown node type: ${nodeType}`);
      }

      // 保存输出
      this.saveNodeOutput(node, output);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      throw e;
    } finally {
      // 记录执行结果
      this.nodeResults.set(node.id, {
        nodeId: node.id,
        nodeType: nodeType,
        input: this.collectInputs(node),
        output,
        error,
        duration: Date.now() - startTime,
      });
    }
  }

  /**
   * 收集节点的输入
   */
  private collectInputs(node: FlowNode): Record<string, unknown> {
    const inputs: Record<string, unknown> = {};
    
    // 获取连接到此节点的边
    for (const edge of this.workflow.edges) {
      if (edge.target !== node.id) continue;
      if (!edge.targetHandle || !edge.sourceHandle) continue;
      
      // 解析 handle ID
      const targetKey = edge.targetHandle.replace('input-', '');
      const sourceKey = edge.sourceHandle.replace('output-', '');
      
      // 获取源节点的输出
      const sourceOutputs = this.nodeOutputs.get(edge.source);
      if (sourceOutputs) {
        inputs[targetKey] = sourceOutputs[sourceKey] ?? sourceOutputs;
      }
    }

    return inputs;
  }

  /**
   * 保存节点输出
   */
  private saveNodeOutput(node: FlowNode, output: unknown): void {
    const outputs: Record<string, unknown> = {};
    
    if (typeof output === 'object' && output !== null && !Array.isArray(output)) {
      Object.assign(outputs, output);
    } else {
      outputs['result'] = output;
    }
    
    this.nodeOutputs.set(node.id, outputs);
  }

  /**
   * 执行 Action 节点
   */
  private async executeActionNode(
    node: FlowNode,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const data = node.data as ActionNodeData;
    const actionName = data.action.name;
    
    const action = this.config.getActionByName(actionName);
    if (!action) {
      throw new Error(`Action not found: ${actionName}`);
    }

    return await action.execute(inputs, this.config.context);
  }

  /**
   * 执行 Util 节点
   */
  private executeUtilNode(node: FlowNode, inputs: Record<string, unknown>): unknown {
    const data = node.data as UtilNodeData;
    return executeUtil(data.utilType, inputs);
  }

  /**
   * 执行 Assign 节点
   */
  private executeAssignNode(node: FlowNode, inputs: Record<string, unknown>): unknown {
    const data = node.data as AssignNodeData;
    const value = inputs['value'];
    this.variables.set(data.targetVariableKey, value);
    return value;
  }

  /**
   * 执行 If 节点
   */
  private async executeIfNode(
    node: FlowNode,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const data = node.data as IfNodeData;
    const condition = Boolean(inputs['condition']);

    // 根据条件执行对应的子流程
    const childNodeIds = condition ? data.ifChildNodeIds : (data.hasElse ? data.elseChildNodeIds : []);
    
    let lastOutput: unknown;
    for (const childId of childNodeIds || []) {
      await this.executeFromNode(childId);
      const result = this.nodeResults.get(childId);
      if (result) {
        lastOutput = result.output;
      }
    }

    return lastOutput;
  }

  /**
   * 执行 Loop 节点
   */
  private async executeLoopNode(
    node: FlowNode,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const data = node.data as LoopNodeData;
    const arrayInput = inputs['array'];
    const countInput = inputs['count'];
    
    let iterations: number;
    let items: unknown[] | undefined;

    if (Array.isArray(arrayInput)) {
      items = arrayInput;
      iterations = items.length;
    } else if (typeof countInput === 'number') {
      iterations = countInput;
    } else {
      iterations = 0;
    }

    // 限制最大循环次数
    iterations = Math.min(iterations, this.config.maxLoopIterations!);

    const results: unknown[] = [];

    for (let i = 0; i < iterations; i++) {
      // 设置循环变量
      const loopVars: Record<string, unknown> = {
        index: i,
        item: items ? items[i] : i,
      };
      
      // 将循环变量注入到子节点
      this.nodeOutputs.set(`${node.id}-loop`, loopVars);

      // 执行子流程
      for (const childId of data.childNodeIds || []) {
        await this.executeFromNode(childId);
        const result = this.nodeResults.get(childId);
        if (result) {
          results.push(result.output);
        }
      }
    }

    return results;
  }
}

/**
 * 创建流程执行函数
 * @param getActionByName - 获取 Action 的函数
 * @returns runFlow 函数
 */
export function createFlowRunner(getActionByName: GetActionByName) {
  return async function runFlow(
    workflow: WorkflowDefinition,
    input: Record<string, unknown>,
    context: ActionContext
  ): Promise<FlowExecutionResult> {
    const executor = new FlowExecutor(workflow, {
      getActionByName,
      context,
    });
    return executor.execute(input);
  };
}

/**
 * 将 Tool（带 inputSchema + implementation/workflow）转换为可执行的 Action
 */
export function createToolAction(
  tool: {
    name: string;
    inputSchema: Record<string, unknown> | null;
    outputSchema: Record<string, unknown> | null;
    implementation: string | null;
  },
  getActionByName: GetActionByName
) {
  return {
    name: tool.name,
    execute: async (input: Record<string, unknown>, context: ActionContext) => {
      if (!tool.implementation) {
        throw new Error(`Tool ${tool.name} has no implementation`);
      }

      // 解析 implementation（JSON 格式的 WorkflowDefinition）
      const workflow = JSON.parse(tool.implementation) as WorkflowDefinition;
      
      const executor = new FlowExecutor(workflow, {
        getActionByName,
        context,
      });
      
      const result = await executor.execute(input);
      
      if (!result.success) {
        throw new Error(result.error || 'Flow execution failed');
      }
      
      return result.output;
    },
  };
}
