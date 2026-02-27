/**
 * LoopNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { LoopNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as LoopNodeData;

	// 检查最大循环次数
	if (!nodeData.maxIterations || nodeData.maxIterations <= 0) {
		issues.push({
			id: `${nodeId}-invalid-max-iterations`,
			severity: 'error',
			message: '最大循环次数必须大于 0',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'maxIterations',
		});
	}

	// 检查是否有输入连接
	const hasIncomingEdge = context.edges.some(e => e.target === nodeId);
	if (!hasIncomingEdge) {
		issues.push({
			id: `${nodeId}-no-input`,
			severity: 'warning',
			message: '节点没有输入连接',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	return issues;
}
