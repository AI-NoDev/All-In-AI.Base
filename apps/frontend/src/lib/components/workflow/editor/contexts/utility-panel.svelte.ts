/**
 * 右侧工具面板状态管理
 * 用于管理环境变量、系统变量等面板的显示状态
 */

export type UtilityPanelType = 'variables' | 'environment' | 'system' | 'issues' | null;

function createUtilityPanelState() {
	let activePanel = $state<UtilityPanelType>(null);

	return {
		get activePanel() { return activePanel; },
		
		open(panel: UtilityPanelType) {
			activePanel = panel;
		},
		
		close() {
			activePanel = null;
		},
		
		toggle(panel: UtilityPanelType) {
			if (activePanel === panel) {
				activePanel = null;
			} else {
				activePanel = panel;
			}
		},
		
		isOpen(panel: UtilityPanelType) {
			return activePanel === panel;
		}
	};
}

export const utilityPanelState = createUtilityPanelState();
