/**
 * OutputNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { OutputNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as OutputNodeData;

	// 检查是否有输入连接
	const hasIncomingEdge = context.edges.some(e => e.target === nodeId);
	if (!hasIncomingEdge) {
		issues.push({
			id: `${nodeId}-no-input`,
			severity: 'error',
			message: '输出节点没有输入连接',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	// 检查输出变量配置
	if (!nodeData.variables || nodeData.variables.length === 0) {
		issues.push({
			id: `${nodeId}-no-outputs`,
			severity: 'warning',
			message: '未配置输出变量',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'variables',
		});
	} else {
		// 检查每个输出变量的名称是否为空
		for (let i = 0; i < nodeData.variables.length; i++) {
			const variable = nodeData.variables[i];
			if (!variable.name || variable.name.trim() === '') {
				issues.push({
					id: `${nodeId}-variable-${variable.id}-no-name`,
					severity: 'error',
					message: `输出变量 #${i + 1} 的变量名不能为空`,
					nodeId,
					nodeTitle,
					nodeType,
					field: `variables[${i}].name`,
				});
			}
		}
	}

	return issues;
}
