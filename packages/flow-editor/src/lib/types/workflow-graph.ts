import type {
	WorkflowNode,
	WorkflowEdge,
	Variable,
	EnvironmentVariable,
	ConversationVariable,
	WorkflowFeatures,
	WorkflowMetadata,
	BaseNodeData
} from './workflow.js';

/**
 * 工作流图数据结构 - 对应 Dify DSL 的顶级结构
 * @template TNodeData - 节点数据类型，必须继承 BaseNodeData
 */
export class WorkflowGraph<TNodeData extends BaseNodeData = BaseNodeData> {
	/** 工作流元数据 */
	metadata: WorkflowMetadata;

	/** 节点列表 */
	nodes: WorkflowNode<TNodeData>[];

	/** 边列表 */
	edges: WorkflowEdge[];

	/** 输入变量（用户输入） */
	variables: Variable[];

	/** 环境变量 */
	environment_variables: EnvironmentVariable[];

	/** 会话变量 */
	conversation_variables: ConversationVariable[];

	/** 工作流特性配置 */
	features: WorkflowFeatures;

	constructor(options?: Partial<WorkflowGraphOptions<TNodeData>>) {
		this.metadata = options?.metadata ?? { name: 'Untitled Workflow' };
		this.nodes = options?.nodes ?? [];
		this.edges = options?.edges ?? [];
		this.variables = options?.variables ?? [];
		this.environment_variables = options?.environment_variables ?? [];
		this.conversation_variables = options?.conversation_variables ?? [];
		this.features = options?.features ?? {};
	}

	// ============ 节点操作 ============

	/**
	 * 添加节点
	 */
	addNode(node: WorkflowNode<TNodeData>): void {
		this.nodes.push(node);
	}

	/**
	 * 根据 ID 获取节点
	 */
	getNode(id: string): WorkflowNode<TNodeData> | undefined {
		return this.nodes.find((n) => n.id === id);
	}

	/**
	 * 更新节点
	 */
	updateNode(id: string, data: Partial<TNodeData>): boolean {
		const node = this.getNode(id);
		if (node) {
			node.data = { ...node.data, ...data } as TNodeData;
			return true;
		}
		return false;
	}

	/**
	 * 删除节点（同时删除相关的边）
	 */
	removeNode(id: string): boolean {
		const index = this.nodes.findIndex((n) => n.id === id);
		if (index !== -1) {
			this.nodes.splice(index, 1);
			// 删除与该节点相关的所有边
			this.edges = this.edges.filter((e) => e.source !== id && e.target !== id);
			return true;
		}
		return false;
	}

	// ============ 边操作 ============

	/**
	 * 添加边
	 */
	addEdge(edge: WorkflowEdge): void {
		this.edges.push(edge);
	}

	/**
	 * 根据 ID 获取边
	 */
	getEdge(id: string): WorkflowEdge | undefined {
		return this.edges.find((e) => e.id === id);
	}

	/**
	 * 删除边
	 */
	removeEdge(id: string): boolean {
		const index = this.edges.findIndex((e) => e.id === id);
		if (index !== -1) {
			this.edges.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * 获取节点的入边
	 */
	getIncomingEdges(nodeId: string): WorkflowEdge[] {
		return this.edges.filter((e) => e.target === nodeId);
	}

	/**
	 * 获取节点的出边
	 */
	getOutgoingEdges(nodeId: string): WorkflowEdge[] {
		return this.edges.filter((e) => e.source === nodeId);
	}

	// ============ 变量操作 ============

	/**
	 * 添加输入变量
	 */
	addVariable(variable: Variable): void {
		this.variables.push(variable);
	}

	/**
	 * 获取变量
	 */
	getVariable(id: string): Variable | undefined {
		return this.variables.find((v) => v.id === id);
	}

	/**
	 * 删除变量
	 */
	removeVariable(id: string): boolean {
		const index = this.variables.findIndex((v) => v.id === id);
		if (index !== -1) {
			this.variables.splice(index, 1);
			return true;
		}
		return false;
	}

	// ============ 序列化 ============

	/**
	 * 导出为 Dify DSL 格式的 JSON
	 */
	toJSON(): WorkflowGraphJSON<TNodeData> {
		return {
			metadata: this.metadata,
			nodes: this.nodes,
			edges: this.edges,
			variables: this.variables,
			environment_variables: this.environment_variables,
			conversation_variables: this.conversation_variables,
			features: this.features
		};
	}

	/**
	 * 从 JSON 创建 WorkflowGraph 实例
	 */
	static fromJSON<T extends BaseNodeData = BaseNodeData>(
		json: WorkflowGraphJSON<T>
	): WorkflowGraph<T> {
		return new WorkflowGraph<T>(json);
	}

	/**
	 * 克隆当前工作流
	 */
	clone(): WorkflowGraph<TNodeData> {
		return WorkflowGraph.fromJSON(JSON.parse(JSON.stringify(this.toJSON())));
	}
}

/**
 * WorkflowGraph 构造选项
 */
export interface WorkflowGraphOptions<TNodeData extends BaseNodeData = BaseNodeData> {
	metadata: WorkflowMetadata;
	nodes: WorkflowNode<TNodeData>[];
	edges: WorkflowEdge[];
	variables: Variable[];
	environment_variables: EnvironmentVariable[];
	conversation_variables: ConversationVariable[];
	features: WorkflowFeatures;
}

/**
 * WorkflowGraph JSON 序列化格式
 */
export type WorkflowGraphJSON<TNodeData extends BaseNodeData = BaseNodeData> =
	WorkflowGraphOptions<TNodeData>;
