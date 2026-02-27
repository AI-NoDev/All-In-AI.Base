/**
 * 工作流验证相关类型定义
 */

/** 问题严重级别 */
export type IssueSeverity = 'error' | 'warning';

/** 验证问题 */
export interface ValidationIssue {
	/** 问题 ID */
	id: string;
	/** 严重级别 */
	severity: IssueSeverity;
	/** 问题消息 */
	message: string;
	/** 关联的节点 ID */
	nodeId: string;
	/** 节点标题（用于显示） */
	nodeTitle: string;
	/** 节点类型 */
	nodeType: string;
	/** 问题字段（可选，用于定位具体配置项） */
	field?: string;
}

/** 验证上下文 */
export interface ValidationContext {
	/** 所有节点 ID 列表 */
	nodeIds: string[];
	/** 所有边 */
	edges: Array<{ source: string; target: string }>;
	/** 环境变量名列表 */
	envVarNames: string[];
	/** 输入变量名列表 */
	inputVarNames: string[];
}

/** 节点验证函数类型 */
export type NodeValidator = (
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
) => ValidationIssue[];
