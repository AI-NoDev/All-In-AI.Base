/**
 * ClassifierNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { ClassifierNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as ClassifierNodeData;

	// 检查模型配置
	if (!nodeData.modelConfig?.provider || !nodeData.modelConfig?.model) {
		issues.push({
			id: `${nodeId}-no-model`,
			severity: 'error',
			message: '未配置模型',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'modelConfig',
		});
	}

	// 检查分类选项
	if (!nodeData.options || nodeData.options.length === 0) {
		issues.push({
			id: `${nodeId}-no-options`,
			severity: 'error',
			message: '未配置分类选项',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'options',
		});
	} else {
		// 检查每个选项是否有名称
		nodeData.options.forEach((opt, index) => {
			if (!opt.label?.trim()) {
				issues.push({
					id: `${nodeId}-option-${opt.id}-no-name`,
					severity: 'error',
					message: `分类选项 ${index + 1} 未设置名称`,
					nodeId,
					nodeTitle,
					nodeType,
					field: `options[${index}].label`,
				});
			}
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
