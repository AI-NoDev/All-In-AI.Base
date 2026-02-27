/**
 * NoteNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { NoteNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	_context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as NoteNodeData;

	// 检查注释内容是否为空
	if (!nodeData.content?.trim()) {
		issues.push({
			id: `${nodeId}-empty-content`,
			severity: 'warning',
			message: '注释内容为空',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'content',
		});
	}

	return issues;
}
