import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData } from '$lib/types/index.js';


/** 开始节点默认 ID */
export const START_NODE_ID = 'start';

/** 创建默认开始节点 */
function createStartNode<T extends BaseNodeData>(): WorkflowNode<T> {
	return {
		id: START_NODE_ID,
		type: 'start',
		position: { x: 100, y: 200 },
		data: {
			title: '开始',
			type: 'start',
			desc: '工作流的起点'
		} as T
	};
}

/**
 * 响应式工作流状态 - 基于 WorkflowGraph 结构
 */
function createWorkflowState<T extends BaseNodeData = BaseNodeData>() {
	// 核心数据 - 默认包含开始节点
	let nodes = $state<WorkflowNode<T>[]>([createStartNode<T>()]);
	let edges = $state<WorkflowEdge[]>([]);
	let variables = $state<Variable[]>([]);

	// 元数据
	let metadata = $state({
		name: 'Untitled Workflow',
		description: '',
		version: '1.0.0'
	});

	// 编辑器状态
	let selectedNodeIds = $state<string[]>([]);
	let selectedEdgeIds = $state<string[]>([]);
	let readonly = $state(false);

	return {
		// Getters
		get nodes() { return nodes; },
		get edges() { return edges; },
		get variables() { return variables; },
		get metadata() { return metadata; },
		get selectedNodeIds() { return selectedNodeIds; },
		get selectedEdgeIds() { return selectedEdgeIds; },
		get readonly() { return readonly; },

		// Setters
		set nodes(v: WorkflowNode<T>[]) { nodes = v; },
		set edges(v: WorkflowEdge[]) { edges = v; },
		set variables(v: Variable[]) { variables = v; },
		set metadata(v: typeof metadata) { metadata = v; },
		set selectedNodeIds(v: string[]) { selectedNodeIds = v; },
		set selectedEdgeIds(v: string[]) { selectedEdgeIds = v; },
		set readonly(v: boolean) { readonly = v; },

		// 节点操作
		addNode(node: WorkflowNode<T>) {
			nodes = [...nodes, node];
		},
		getNode(id: string) {
			return nodes.find((n) => n.id === id);
		},
		updateNode(id: string, data: Partial<T>) {
			nodes = nodes.map((n) =>
				n.id === id ? { ...n, data: { ...n.data, ...data } as T } : n
			);
		},
		removeNode(id: string) {
			// 开始节点不能删除
			if (id === START_NODE_ID) return;
			nodes = nodes.filter((n) => n.id !== id);
			edges = edges.filter((e) => e.source !== id && e.target !== id);
		},

		// 边操作
		addEdge(edge: WorkflowEdge) {
			edges = [...edges, edge];
		},
		getEdge(id: string) {
			return edges.find((e) => e.id === id);
		},
		removeEdge(id: string) {
			edges = edges.filter((e) => e.id !== id);
		},
		getIncomingEdges(nodeId: string) {
			return edges.filter((e) => e.target === nodeId);
		},
		getOutgoingEdges(nodeId: string) {
			return edges.filter((e) => e.source === nodeId);
		},

		// 变量操作
		addVariable(variable: Variable) {
			variables = [...variables, variable];
		},
		getVariable(id: string) {
			return variables.find((v) => v.id === id);
		},
		removeVariable(id: string) {
			variables = variables.filter((v) => v.id !== id);
		},

		// 序列化
		toJSON() {
			return { metadata, nodes, edges, variables };
		},
		fromJSON(json: { metadata?: typeof metadata; nodes?: WorkflowNode<T>[]; edges?: WorkflowEdge[]; variables?: Variable[] }) {
			if (json.metadata) metadata = json.metadata;
			if (json.nodes) nodes = json.nodes;
			if (json.edges) edges = json.edges;
			if (json.variables) variables = json.variables;
		},

		// 清空（保留开始节点）
		clear() {
			nodes = [createStartNode<T>()];
			edges = [];
			variables = [];
			selectedNodeIds = [];
			selectedEdgeIds = [];
		}
	};
}

// 全局单例
export const workflowState = createWorkflowState();
