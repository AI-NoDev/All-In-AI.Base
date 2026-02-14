// 全局工作流状态
export { workflowState, START_NODE_ID } from './editor-state.svelte.js';

// 配置面板注册表
export { configPanelRegistry } from './config-panel.svelte.js';

// 运行状态管理
export { runningState } from './running-state.svelte.js';
export type { NodeRunStatus, NodeRunResult } from './running-state.svelte.js';
