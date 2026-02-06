import type { Component } from 'svelte';

/** 配置面板组件的 Props 接口 */
export interface ConfigPanelProps {
	nodeId: string;
	data: Record<string, unknown>;
}

/**
 * 配置面板注册表
 * 存储每个节点类型对应的配置面板组件
 */
function createConfigPanelRegistry() {
	// 当前选中的节点 ID - 不为 null 就显示 panel
	let selectedNodeId = $state<string | null>(null);
	
	// 节点类型 -> 配置面板组件的映射
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let panels = $state<Map<string, Component<any>>>(new Map());

	return {
		get selectedNodeId() { return selectedNodeId; },
		get panels() { return panels; },

		/** 注册节点类型的配置面板 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		register(nodeType: string, panel: Component<any>) {
			panels.set(nodeType, panel);
		},

		/** 获取节点类型的配置面板 */
		getPanel(nodeType: string) {
			return panels.get(nodeType);
		},

		/** 取消注册 */
		unregister(nodeType: string) {
			panels.delete(nodeType);
		},

		/** 选中节点 */
		selectNode(nodeId: string | null) {
			selectedNodeId = nodeId;
		},

		/** 关闭面板 */
		closePanel() {
			selectedNodeId = null;
		}
	};
}

export const configPanelRegistry = createConfigPanelRegistry();
