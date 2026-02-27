import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData, EnvironmentVariable } from '$lib/components/workflow/types/index';
import type { PendingNodeTemplate, NodePickerState, WorkflowMetadata, InputVariable, TestInputData } from './types';
import { createStartNode, createNodeOperations } from './nodes';
import { createEdgeOperations } from './edges';
import { createVariableOperations } from './variables';
import { createSerializationOperations } from './serialization';

// 导出类型
export type { PendingNodeTemplate, NodePickerState, WorkflowMetadata, InputVariable, TestInputData } from './types';
export { BUILTIN_INPUT_VARIABLES } from './types';

/**
 * 创建响应式工作流状态
 */
function createWorkflowState<T extends BaseNodeData = BaseNodeData>() {
	// 核心数据
	let nodes = $state<WorkflowNode<T>[]>([createStartNode<T>()]);
	let edges = $state<WorkflowEdge[]>([]);
	let variables = $state<Variable[]>([]);
	let inputVariables = $state<InputVariable[]>([]);
	let environmentVariables = $state<EnvironmentVariable[]>([]);
	let testInputs = $state<TestInputData>({ values: {} });

	// 元数据
	let metadata = $state<WorkflowMetadata>({
		name: 'Untitled Workflow',
		description: '',
		version: '1.0.0'
	});

	// 编辑器状态
	let selectedNodeIds = $state<string[]>([]);
	let selectedEdgeIds = $state<string[]>([]);
	let readonly = $state(false);
	let interactionMode = $state<'hand' | 'pointer'>('hand');
	let placingNodeId = $state<string | null>(null);
	let placingNodeTemplate = $state<PendingNodeTemplate | null>(null);
	let nodePickerState = $state<NodePickerState>({
		visible: false,
		position: { x: 0, y: 0 },
		sourceNodeId: '',
		sourceHandleId: ''
	});

	// 创建操作方法
	const nodeOps = createNodeOperations<T>(
		() => nodes, (v) => nodes = v,
		() => edges, (v) => edges = v,
		() => placingNodeId, (v) => placingNodeId = v,
		(v) => placingNodeTemplate = v,
		() => nodePickerState, (v) => nodePickerState = v
	);

	const edgeOps = createEdgeOperations(
		() => edges, (v) => edges = v
	);

	const variableOps = createVariableOperations(
		() => variables, (v) => variables = v,
		() => inputVariables, (v) => inputVariables = v,
		() => environmentVariables, (v) => environmentVariables = v
	);

	const serializationOps = createSerializationOperations<T>({
		getNodes: () => nodes, setNodes: (v) => nodes = v,
		getEdges: () => edges, setEdges: (v) => edges = v,
		getVariables: () => variables, setVariables: (v) => variables = v,
		getInputVariables: () => inputVariables, setInputVariables: (v) => inputVariables = v,
		getEnvironmentVariables: () => environmentVariables, setEnvironmentVariables: (v) => environmentVariables = v,
		getMetadata: () => metadata, setMetadata: (v) => metadata = v,
		getTestInputs: () => testInputs, setTestInputs: (v) => testInputs = v
	});

	return {
		// Getters
		get nodes() { return nodes; },
		get edges() { return edges; },
		get variables() { return variables; },
		get inputVariables() { return inputVariables; },
		get environmentVariables() { return environmentVariables; },
		get testInputs() { return testInputs; },
		get metadata() { return metadata; },
		get selectedNodeIds() { return selectedNodeIds; },
		get selectedEdgeIds() { return selectedEdgeIds; },
		get readonly() { return readonly; },
		get interactionMode() { return interactionMode; },
		get placingNodeId() { return placingNodeId; },
		get placingNodeTemplate() { return placingNodeTemplate; },
		get nodePickerState() { return nodePickerState; },

		// Setters
		set nodes(v: WorkflowNode<T>[]) { nodes = v; },
		set edges(v: WorkflowEdge[]) { edges = v; },
		set variables(v: Variable[]) { variables = v; },
		set inputVariables(v: InputVariable[]) { inputVariables = v; },
		set environmentVariables(v: EnvironmentVariable[]) { environmentVariables = v; },
		set testInputs(v: TestInputData) { testInputs = v; },
		set metadata(v: WorkflowMetadata) { metadata = v; },
		set selectedNodeIds(v: string[]) { selectedNodeIds = v; },
		set selectedEdgeIds(v: string[]) { selectedEdgeIds = v; },
		set readonly(v: boolean) { readonly = v; },
		set interactionMode(v: 'hand' | 'pointer') { interactionMode = v; },

		// 节点操作
		...nodeOps,
		
		// 边操作
		...edgeOps,
		
		// 变量操作
		...variableOps,
		
		// 序列化操作
		...serializationOps
	};
}

// 全局单例
export const workflowState = createWorkflowState();
