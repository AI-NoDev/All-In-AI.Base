/**
 * 工作流核心状态 - 节点、边、变量
 */
import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData, EnvironmentVariable } from '$lib/components/workflow/types/index';
import { START_NODE_ID } from '$lib/components/workflow/constants/index';

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
 * 创建工作流核心状态
 */
export function createWorkflowCoreState<T extends BaseNodeData = BaseNodeData>() {
	// 核心数据 - 默认包含开始节点
	let nodes = $state<WorkflowNode<T>[]>([createStartNode<T>()]);
	let edges = $state<WorkflowEdge[]>([]);
	let variables = $state<Variable[]>([]);
	let environmentVariables = $state<EnvironmentVariable[]>([]);

	// 元数据
	let metadata = $state({
		name: 'Untitled Workflow',
		description: '',
		version: '1.0.0'
	});

	return {
		// Getters
		get nodes() { return nodes; },
		get edges() { return edges; },
		get variables() { return variables; },
		get environmentVariables() { return environmentVariables; },
		get metadata() { return metadata; },

		// Setters
		set nodes(v: WorkflowNode<T>[]) { nodes = v; },
		set edges(v: WorkflowEdge[]) { edges = v; },
		set variables(v: Variable[]) { variables = v; },
		set environmentVariables(v: EnvironmentVariable[]) { environmentVariables = v; },
		set metadata(v: typeof metadata) { metadata = v; },

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
			if (id === START_NODE_ID) return;
			
			const node = nodes.find(n => n.id === id);
			if (node?.type === 'loop') {
				const childIds = nodes.filter(n => n.parentId === id).map(n => n.id);
				nodes = nodes.filter((n) => n.id !== id && n.parentId !== id);
				edges = edges.filter((e) => 
					e.source !== id && 
					e.target !== id && 
					!childIds.includes(e.source) && 
					!childIds.includes(e.target)
				);
			} else {
				nodes = nodes.filter((n) => n.id !== id);
				edges = edges.filter((e) => e.source !== id && e.target !== id);
			}
		},

		getChildNodes(parentId: string) {
			return nodes.filter(n => n.parentId === parentId);
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

		// 清空（保留开始节点）
		clear() {
			nodes = [createStartNode<T>()];
			edges = [];
			variables = [];
			environmentVariables = [];
		},

		// 导出数据
		getData() {
			return { metadata, nodes, edges, variables, environmentVariables };
		},

		// 导入数据
		setData(data: {
			metadata?: typeof metadata;
			nodes?: WorkflowNode<T>[];
			edges?: WorkflowEdge[];
			variables?: Variable[];
			environmentVariables?: EnvironmentVariable[];
		}) {
			if (data.metadata) metadata = data.metadata;
			if (data.nodes) nodes = data.nodes;
			if (data.edges) edges = data.edges;
			if (data.variables) variables = data.variables;
			if (data.environmentVariables) environmentVariables = data.environmentVariables;
		}
	};
}
