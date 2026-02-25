/**
 * 工作流执行引擎
 * 
 * 按拓扑顺序执行工作流节点，管理变量传递和状态
 */
import type { WorkflowNode, WorkflowEdge, BaseNodeData } from '$lib/components/workflow/types/index';
import { START_NODE_ID } from '$lib/components/workflow/constants/index';
import { VariableResolver } from './variable-resolver';
import { WorkflowValidator } from './validator';
import type {
	ExecutionContext,
	ExecutionResult,
	ExecutionOptions,
	ExecutionEvent,
	NodeExecutionResult,
	NodeExecutor,
	NodeExecutorRegistry,
} from './types';

export class WorkflowEngine {
	private nodes: WorkflowNode<BaseNodeData>[];
	private edges: WorkflowEdge[];
	private executors: NodeExecutorRegistry;
	private context: ExecutionContext | null = null;
	private abortController: AbortController | null = null;
	private onEvent?: (event: ExecutionEvent) => void;

	constructor(
		nodes: WorkflowNode<BaseNodeData>[],
		edges: WorkflowEdge[],
		executors: NodeExecutorRegistry
	) {
		this.nodes = nodes;
		this.edges = edges;
		this.executors = executors;
	}

	/**
	 * 执行工作流
	 */
	async execute(options: ExecutionOptions = {}): Promise<ExecutionResult> {
		const startTime = Date.now();
		const executionId = crypto.randomUUID();
		const nodeResults: NodeExecutionResult[] = [];
		
		this.onEvent = options.onEvent;
		this.abortController = new AbortController();

		// 初始化执行上下文
		this.context = {
			workflowId: executionId,
			executionId,
			isTest: options.isTest ?? false,
			variables: new Map(),
			environmentVariables: options.environmentVariables ?? {},
			systemVariables: options.systemVariables ?? {},
			userInputs: options.userInputs ?? {},
		};

		this.emitEvent('workflow:start', undefined, { options });

		try {
			// 验证工作流
			const validator = new WorkflowValidator(this.nodes, this.edges);
			const validation = validator.validate();
			
			if (!validation.valid) {
				throw new Error(`工作流验证失败: ${validation.errors.map(e => e.message).join(', ')}`);
			}

			// 获取执行顺序
			const executionOrder = this.getExecutionOrder(options.startFromNodeId);

			// 按顺序执行节点
			for (const nodeId of executionOrder) {
				if (this.abortController.signal.aborted) {
					throw new Error('执行已取消');
				}

				const node = this.nodes.find(n => n.id === nodeId);
				if (!node) continue;

				// 跳过注释节点
				if (node.type === 'note') continue;

				const result = await this.executeNode(node);
				nodeResults.push(result);

				// 如果节点执行失败，检查是否需要停止
				if (result.status === 'error') {
					// 检查是否有异常分支
					const hasExceptionBranch = this.edges.some(
						e => e.source === nodeId && e.sourceHandle === 'exception'
					);
					
					if (!hasExceptionBranch) {
						throw new Error(result.error ?? '节点执行失败');
					}
				}
			}

			// 收集输出
			const outputs = this.collectOutputs();

			// 计算 token 统计
			const totalTokens = this.calculateTotalTokens(nodeResults);

			const endTime = Date.now();
			const result: ExecutionResult = {
				executionId,
				status: 'success',
				startTime,
				endTime,
				elapsed: endTime - startTime,
				nodeResults,
				outputs,
				totalTokens,
			};

			this.emitEvent('workflow:complete', undefined, result);
			return result;

		} catch (error) {
			const endTime = Date.now();
			const errorMessage = error instanceof Error ? error.message : String(error);
			
			const result: ExecutionResult = {
				executionId,
				status: 'error',
				startTime,
				endTime,
				elapsed: endTime - startTime,
				nodeResults,
				error: errorMessage,
			};

			this.emitEvent('workflow:error', undefined, { error: errorMessage });
			return result;

		} finally {
			this.context = null;
			this.abortController = null;
		}
	}

	/**
	 * 取消执行
	 */
	cancel(): void {
		this.abortController?.abort();
	}

	/**
	 * 执行单个节点
	 */
	private async executeNode(node: WorkflowNode<BaseNodeData>): Promise<NodeExecutionResult> {
		const startTime = Date.now();
		const nodeType = node.type ?? 'unknown';

		this.emitEvent('node:start', node.id, { nodeType });

		try {
			// 获取节点执行器
			const executor = this.executors.get(nodeType);
			if (!executor) {
				throw new Error(`未找到节点类型 "${nodeType}" 的执行器`);
			}

			// 解析输入变量
			const resolver = new VariableResolver(this.context!);
			const inputs = this.resolveNodeInputs(node, resolver);

			// 执行节点
			const outputs = await executor.execute(node, inputs, this.context!);

			// 存储输出变量
			resolver.setNodeOutputs(node.id, outputs);

			const endTime = Date.now();
			const result: NodeExecutionResult = {
				nodeId: node.id,
				nodeType,
				status: 'success',
				inputs,
				outputs,
				startTime,
				endTime,
				elapsed: endTime - startTime,
				tokens: (outputs._tokens as NodeExecutionResult['tokens']) ?? undefined,
			};

			this.emitEvent('node:complete', node.id, result);
			return result;

		} catch (error) {
			const endTime = Date.now();
			const errorMessage = error instanceof Error ? error.message : String(error);

			const result: NodeExecutionResult = {
				nodeId: node.id,
				nodeType,
				status: 'error',
				error: errorMessage,
				startTime,
				endTime,
				elapsed: endTime - startTime,
			};

			this.emitEvent('node:error', node.id, { error: errorMessage });
			return result;
		}
	}

	/**
	 * 解析节点输入变量
	 */
	private resolveNodeInputs(
		node: WorkflowNode<BaseNodeData>,
		resolver: VariableResolver
	): Record<string, unknown> {
		const data = node.data as Record<string, unknown>;
		const inputs: Record<string, unknown> = {};

		// 处理上下文变量引用
		if (data.context && Array.isArray(data.context)) {
			for (const ctx of data.context as Array<{ path: string }>) {
				const value = resolver.resolve(ctx.path);
				const name = ctx.path.split('.').pop() ?? ctx.path;
				inputs[name] = value;
			}
		}

		// 处理模板字符串
		if (data.systemPrompt && typeof data.systemPrompt === 'string') {
			inputs.systemPrompt = resolver.resolveTemplate(data.systemPrompt);
		}
		if (data.userPromptTemplate && typeof data.userPromptTemplate === 'string') {
			inputs.userPromptTemplate = resolver.resolveTemplate(data.userPromptTemplate);
		}

		// 处理输入变量引用
		if (data.inputVariable && typeof data.inputVariable === 'string') {
			inputs.input = resolver.resolve(data.inputVariable);
		}

		return inputs;
	}

	/**
	 * 获取执行顺序（拓扑排序）
	 */
	private getExecutionOrder(startFromNodeId?: string): string[] {
		const startId = startFromNodeId ?? START_NODE_ID;
		const order: string[] = [];
		const visited = new Set<string>();

		// 构建邻接表
		const adjacency = new Map<string, string[]>();
		for (const node of this.nodes) {
			adjacency.set(node.id, []);
		}
		for (const edge of this.edges) {
			// 跳过异常分支
			if (edge.sourceHandle === 'exception') continue;
			
			const targets = adjacency.get(edge.source);
			if (targets) {
				targets.push(edge.target);
			}
		}

		// BFS 遍历
		const queue: string[] = [startId];
		
		while (queue.length > 0) {
			const nodeId = queue.shift()!;
			
			if (visited.has(nodeId)) continue;
			visited.add(nodeId);
			
			// 检查所有前置节点是否已访问
			const incomingEdges = this.edges.filter(e => e.target === nodeId && e.sourceHandle !== 'exception');
			const allPredecessorsVisited = incomingEdges.every(e => visited.has(e.source));
			
			if (!allPredecessorsVisited && nodeId !== startId) {
				// 前置节点未全部完成，重新入队
				visited.delete(nodeId);
				queue.push(nodeId);
				continue;
			}

			order.push(nodeId);

			// 添加后继节点
			const successors = adjacency.get(nodeId) ?? [];
			for (const successor of successors) {
				if (!visited.has(successor)) {
					queue.push(successor);
				}
			}
		}

		return order;
	}

	/**
	 * 收集输出节点的输出
	 */
	private collectOutputs(): Record<string, unknown> {
		const outputNode = this.nodes.find(n => n.type === 'output');
		if (!outputNode || !this.context) return {};

		const resolver = new VariableResolver(this.context);
		const data = outputNode.data as Record<string, unknown>;
		const outputs = data.outputs as Array<{ name: string; value: string }> | undefined;

		if (!outputs) return {};

		const result: Record<string, unknown> = {};
		for (const output of outputs) {
			result[output.name] = resolver.resolve(output.value);
		}

		return result;
	}

	/**
	 * 计算总 token 使用量
	 */
	private calculateTotalTokens(results: NodeExecutionResult[]): ExecutionResult['totalTokens'] {
		let prompt = 0;
		let completion = 0;

		for (const result of results) {
			if (result.tokens) {
				prompt += result.tokens.prompt;
				completion += result.tokens.completion;
			}
		}

		if (prompt === 0 && completion === 0) return undefined;

		return { prompt, completion, total: prompt + completion };
	}

	/**
	 * 发送执行事件
	 */
	private emitEvent(type: ExecutionEvent['type'], nodeId?: string, data?: unknown): void {
		if (!this.onEvent) return;

		const node = nodeId ? this.nodes.find(n => n.id === nodeId) : undefined;

		this.onEvent({
			type,
			nodeId,
			nodeType: node?.type,
			data,
			timestamp: Date.now(),
		});
	}
}
