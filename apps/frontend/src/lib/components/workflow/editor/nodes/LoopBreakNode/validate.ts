/**
 * LoopBreakNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	_data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

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
