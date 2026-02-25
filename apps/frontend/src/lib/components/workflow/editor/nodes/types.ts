/**
 * 节点相关类型定义
 */

/** 输出引脚配置 */
export interface OutputHandle {
	/** 引脚 ID */
	id: string;
	/** 引脚位置（相对于节点顶部的 px 值） */
	top: number;
	/** 是否显示（默认 true） */
	visible?: boolean;
}
