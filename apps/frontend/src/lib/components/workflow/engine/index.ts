/**
 * 工作流执行引擎
 * 
 * 负责按拓扑顺序执行工作流节点，管理变量传递和状态
 */

export { WorkflowEngine } from './workflow-engine';
export { VariableResolver } from './variable-resolver';
export { WorkflowValidator, type ValidationResult, type ValidationError } from './validator';
export type { 
	ExecutionContext, 
	ExecutionResult, 
	NodeExecutor,
	ExecutionOptions,
	ExecutionEvent,
	ExecutionEventType,
} from './types';
