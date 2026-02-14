// 基础类型导出
export type {
	VariableType,
	VariableValue,
	Variable,
	EnvironmentVariable,
	ConversationVariable,
	BaseNodeData,
	WorkflowNode,
	WorkflowEdge,
	WorkflowEdgeData,
	WorkflowFeatures,
	WorkflowMetadata,
	NodeRunStatus,
	NodeRunData
} from './workflow.js';

// 工作流图类导出
export { WorkflowGraph } from './workflow-graph.js';
export type { WorkflowGraphOptions, WorkflowGraphJSON } from './workflow-graph.js';

// 节点运行相关类型
/** 节点运行参数 */
export interface NodeRunningParams {
	/** 节点类型 */
	nodeType: string;
	/** 节点输入数据 */
	input: unknown;
	/** 是否为测试运行 */
	isTest: boolean;
}

/** 节点运行回调函数类型 */
export type OnNodeRunning = (params: NodeRunningParams) => Promise<unknown>;