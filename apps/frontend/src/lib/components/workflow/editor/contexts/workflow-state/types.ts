import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData, EnvironmentVariable } from '$lib/components/workflow/types/index';

/** 待放置节点模板 */
export interface PendingNodeTemplate {
	type: string;
	label: string;
	icon: string;
	color: string;
}

/** 节点选择器弹出状态 */
export interface NodePickerState {
	visible: boolean;
	position: { x: number; y: number };
	sourceNodeId: string;
	sourceHandleId: string;
	parentLoopId?: string;
	handleOffsetY?: number;
}

/** 工作流元数据 */
export interface WorkflowMetadata {
	name: string;
	description: string;
	version: string;
}

/** 输入变量定义 */
export interface InputVariable {
	id: string;
	name: string;
	label: string;
	type: string;
	description?: string;
	required?: boolean;
	/** 是否为系统内置变量 */
	builtin?: boolean;
}

/** 内置系统输入变量 */
export const BUILTIN_INPUT_VARIABLES: InputVariable[] = [
	{
		id: 'sys.files',
		name: 'files',
		label: '输入文件',
		type: 'file-list',
		description: '用户上传的文件列表',
		required: false,
		builtin: true
	}
];

/** 工作流状态核心数据 */
export interface WorkflowStateData<T extends BaseNodeData = BaseNodeData> {
	nodes: WorkflowNode<T>[];
	edges: WorkflowEdge[];
	variables: Variable[];
	inputVariables: InputVariable[];
	environmentVariables: EnvironmentVariable[];
	metadata: WorkflowMetadata;
	selectedNodeIds: string[];
	selectedEdgeIds: string[];
	readonly: boolean;
	interactionMode: 'hand' | 'pointer';
	placingNodeId: string | null;
	placingNodeTemplate: PendingNodeTemplate | null;
	nodePickerState: NodePickerState;
}
