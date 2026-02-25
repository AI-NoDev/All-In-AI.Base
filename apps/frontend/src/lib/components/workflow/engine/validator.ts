/**
 * 工作流验证器 - 检查工作流完整性和正确性
 */
import type { WorkflowNode, WorkflowEdge, BaseNodeData } from '$lib/components/workflow/types/index';
import { START_NODE_ID } from '$lib/components/workflow/constants/index';

/** 验证错误级别 */
export type ValidationSeverity = 'error' | 'warning';

/** 验证错误 */
export interface ValidationError {
	/** 错误级别 */
	severity: ValidationSeverity;
	/** 错误代码 */
	code: string;
	/** 错误消息 */
	message: string;
	/** 相关节点 ID */
	nodeId?: string;
	/** 相关边 ID */
	edgeId?: string;
}

/** 验证结果 */
export interface ValidationResult {
	/** 是否有效（无 error 级别错误） */
	valid: boolean;
	/** 错误列表 */
	errors: ValidationError[];
	/** 警告数量 */
	warningCount: number;
	/** 错误数量 */
	errorCount: number;
}

export class WorkflowValidator {
	private nodes: WorkflowNode<BaseNodeData>[];
	private edges: WorkflowEdge[];
	private errors: ValidationError[] = [];

	constructor(nodes: WorkflowNode<BaseNodeData>[], edges: WorkflowEdge[]) {
		this.nodes = nodes;
		this.edges = edges;
	}

	/**
	 * 执行完整验证
	 */
	validate(): ValidationResult {
		this.errors = [];

		this.validateStartNode();
		this.validateNodeConnections();
		this.validateNoOrphanNodes();
		this.validateNoCycles();
		this.validateNodeConfigs();
		this.validateOutputNode();

		const errorCount = this.errors.filter(e => e.severity === 'error').length;
		const warningCount = this.errors.filter(e => e.severity === 'warning').length;

		return {
			valid: errorCount === 0,
			errors: this.errors,
			errorCount,
			warningCount,
		};
	}

	/** 验证开始节点存在 */
	private validateStartNode(): void {
		const startNode = this.nodes.find(n => n.id === START_NODE_ID);
		if (!startNode) {
			this.addError('error', 'MISSING_START_NODE', '工作流缺少开始节点');
		}
	}

	/** 验证节点连接有效性 */
	private validateNodeConnections(): void {
		const nodeIds = new Set(this.nodes.map(n => n.id));

		for (const edge of this.edges) {
			if (!nodeIds.has(edge.source)) {
				this.addError('error', 'INVALID_EDGE_SOURCE', `边的源节点不存在: ${edge.source}`, undefined, edge.id);
			}
			if (!nodeIds.has(edge.target)) {
				this.addError('error', 'INVALID_EDGE_TARGET', `边的目标节点不存在: ${edge.target}`, undefined, edge.id);
			}
		}
	}

	/** 验证没有孤立节点（除了注释节点） */
	private validateNoOrphanNodes(): void {
		const connectedNodes = new Set<string>();
		
		// 开始节点总是连接的
		connectedNodes.add(START_NODE_ID);

		// 收集所有通过边连接的节点
		for (const edge of this.edges) {
			connectedNodes.add(edge.source);
			connectedNodes.add(edge.target);
		}

		// 检查孤立节点
		for (const node of this.nodes) {
			// 跳过注释节点和循环内子节点
			if (node.type === 'note' || node.parentId) continue;

			if (!connectedNodes.has(node.id)) {
				this.addWarning('ORPHAN_NODE', `节点 "${node.data.title}" 未连接到工作流`, node.id);
			}
		}
	}

	/** 验证没有循环依赖（DAG 检查） */
	private validateNoCycles(): void {
		const adjacency = new Map<string, string[]>();
		
		// 构建邻接表
		for (const node of this.nodes) {
			adjacency.set(node.id, []);
		}
		for (const edge of this.edges) {
			const targets = adjacency.get(edge.source);
			if (targets) {
				targets.push(edge.target);
			}
		}

		// DFS 检测环
		const visited = new Set<string>();
		const recursionStack = new Set<string>();

		const hasCycle = (nodeId: string): boolean => {
			visited.add(nodeId);
			recursionStack.add(nodeId);

			const neighbors = adjacency.get(nodeId) ?? [];
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					if (hasCycle(neighbor)) return true;
				} else if (recursionStack.has(neighbor)) {
					return true;
				}
			}

			recursionStack.delete(nodeId);
			return false;
		};

		for (const node of this.nodes) {
			if (!visited.has(node.id)) {
				if (hasCycle(node.id)) {
					this.addError('error', 'CYCLE_DETECTED', '工作流中存在循环依赖');
					break;
				}
			}
		}
	}

	/** 验证节点配置完整性 */
	private validateNodeConfigs(): void {
		for (const node of this.nodes) {
			switch (node.type) {
				case 'llm':
					this.validateLLMNode(node);
					break;
				case 'if':
					this.validateIfNode(node);
					break;
				case 'classifier':
					this.validateClassifierNode(node);
					break;
				case 'loop':
					this.validateLoopNode(node);
					break;
				case 'output':
					this.validateOutputNodeConfig(node);
					break;
			}
		}
	}

	/** 验证 LLM 节点配置 */
	private validateLLMNode(node: WorkflowNode<BaseNodeData>): void {
		const data = node.data as Record<string, unknown>;
		
		if (!data.modelConfig) {
			this.addError('error', 'LLM_NO_MODEL', 'LLM 节点未配置模型', node.id);
		}
	}

	/** 验证 IF 节点配置 */
	private validateIfNode(node: WorkflowNode<BaseNodeData>): void {
		const data = node.data as Record<string, unknown>;
		const cases = data.cases as Array<{ conditions: unknown[] }> | undefined;
		
		if (!cases || cases.length === 0) {
			this.addWarning('IF_NO_CONDITIONS', 'IF 节点未配置条件', node.id);
		} else {
			const hasEmptyCase = cases.some(c => !c.conditions || c.conditions.length === 0);
			if (hasEmptyCase) {
				this.addWarning('IF_EMPTY_CONDITION', 'IF 节点存在空条件分支', node.id);
			}
		}
	}

	/** 验证分类器节点配置 */
	private validateClassifierNode(node: WorkflowNode<BaseNodeData>): void {
		const data = node.data as Record<string, unknown>;
		const options = data.options as unknown[] | undefined;
		
		if (!options || options.length === 0) {
			this.addError('error', 'CLASSIFIER_NO_OPTIONS', '分类器节点未配置分类选项', node.id);
		}
	}

	/** 验证循环节点配置 */
	private validateLoopNode(node: WorkflowNode<BaseNodeData>): void {
		// 检查循环内是否有子节点
		const childNodes = this.nodes.filter(n => n.parentId === node.id);
		if (childNodes.length === 0) {
			this.addWarning('LOOP_EMPTY', '循环节点内没有子节点', node.id);
		}
	}

	/** 验证输出节点配置 */
	private validateOutputNodeConfig(node: WorkflowNode<BaseNodeData>): void {
		const data = node.data as Record<string, unknown>;
		const outputs = data.outputs as unknown[] | undefined;
		
		if (!outputs || outputs.length === 0) {
			this.addWarning('OUTPUT_NO_VARIABLES', '输出节点未配置输出变量', node.id);
		}
	}

	/** 验证存在输出节点 */
	private validateOutputNode(): void {
		const outputNode = this.nodes.find(n => n.type === 'output');
		if (!outputNode) {
			this.addWarning('NO_OUTPUT_NODE', '工作流没有输出节点，执行结果将为空');
		}
	}

	private addError(severity: ValidationSeverity, code: string, message: string, nodeId?: string, edgeId?: string): void {
		this.errors.push({ severity, code, message, nodeId, edgeId });
	}

	private addWarning(code: string, message: string, nodeId?: string): void {
		this.errors.push({ severity: 'warning', code, message, nodeId });
	}
}
