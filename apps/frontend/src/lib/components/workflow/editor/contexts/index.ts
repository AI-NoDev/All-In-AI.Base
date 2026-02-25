// 全局工作流状态（模块化）
export { workflowState, BUILTIN_INPUT_VARIABLES } from './workflow-state/index.svelte';
export type { PendingNodeTemplate, NodePickerState, WorkflowMetadata, InputVariable } from './workflow-state/index.svelte';

// 常量从统一位置导出
export { START_NODE_ID, LOOP_HEADER_HEIGHT } from '$lib/components/workflow/constants/index';

// 配置面板注册器
export { configPanelRegistry } from './config-panel.svelte';

// 运行状态管理
export { runningState } from './running-state.svelte';
export type { NodeRunStatus } from './running-state.svelte';

// 工具面板状态
export { utilityPanelState } from './utility-panel.svelte';
export type { UtilityPanelType } from './utility-panel.svelte';
