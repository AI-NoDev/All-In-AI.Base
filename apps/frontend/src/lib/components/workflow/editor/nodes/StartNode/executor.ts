/**
 * 开始节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import type { StartNodeData, InputField } from './types';

export class StartNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<StartNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const inputFields = data.inputs ?? [];
		const outputs: Record<string, unknown> = {};

		// 处理每个输入字段
		for (const field of inputFields) {
			const userValue = context.userInputs[field.variable];
			
			if (userValue !== undefined) {
				outputs[field.variable] = this.convertValue(userValue, field);
			} else if (field.defaultValue !== undefined) {
				outputs[field.variable] = field.defaultValue;
			} else {
				outputs[field.variable] = this.getEmptyValue(field);
			}
		}

		// 添加系统文件变量
		if (context.userFiles && context.userFiles.length > 0) {
			outputs['sys.user_files'] = context.userFiles;
		}

		return outputs;
	}

	private convertValue(value: unknown, field: InputField): unknown {
		switch (field.type) {
			case 'number':
				return typeof value === 'number' ? value : Number(value) || 0;
			case 'boolean':
				if (typeof value === 'boolean') return value;
				if (typeof value === 'string') return value === 'true' || value === '1';
				return Boolean(value);
			case 'object':
				if (typeof value === 'object') return value;
				if (typeof value === 'string') {
					try { return JSON.parse(value); } catch { return {}; }
				}
				return {};
			case 'array-string':
				if (Array.isArray(value)) return value.map(String);
				if (typeof value === 'string') return value.split('\n').filter(Boolean);
				return [];
			case 'array-number':
				if (Array.isArray(value)) return value.map(Number).filter(n => !isNaN(n));
				if (typeof value === 'string') return value.split('\n').map(Number).filter(n => !isNaN(n));
				return [];
			case 'array-object':
				if (Array.isArray(value)) return value;
				return [];
			case 'file':
			case 'file-list':
				return value;
			default:
				return String(value ?? '');
		}
	}

	private getEmptyValue(field: InputField): unknown {
		switch (field.type) {
			case 'number': return 0;
			case 'boolean': return false;
			case 'object': return {};
			case 'array-string':
			case 'array-number':
			case 'array-object':
			case 'file-list': return [];
			case 'file': return null;
			default: return '';
		}
	}
}
