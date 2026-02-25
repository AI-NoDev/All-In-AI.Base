// 全局工作流状态
export { workflowState } from './editor-state.svelte';

// 常量从统一位置导出
export { START_NODE_ID, LOOP_HEADER_HEIGHT } from '$lib/components/workflow/constants/index';

// 配置面板注册器
export { configPanelRegistry } from './config-panel.svelte';

// 运行状态管理
export { runningState } from './running-state.svelte';
export type { NodeRunStatus } from './running-state.svelte';
