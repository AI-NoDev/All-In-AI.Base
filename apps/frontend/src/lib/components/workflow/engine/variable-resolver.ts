/**
 * 变量解析器 - 解析变量引用并获取值
 */
import type { ExecutionContext } from './types';

/** 变量路径格式: nodeId.variableName 或 sys.variableName 或 env.variableName */
const VARIABLE_PATH_REGEX = /^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_]+)$/;

/** 模板变量格式: {{nodeId.variableName}} */
const TEMPLATE_VARIABLE_REGEX = /\{\{([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_]+)\}\}/g;

export class VariableResolver {
	private context: ExecutionContext;

	constructor(context: ExecutionContext) {
		this.context = context;
	}

	/**
	 * 解析单个变量路径，返回值
	 * @param path 变量路径，如 "start.input_1" 或 "sys.user_id" 或 "env.API_KEY"
	 */
	resolve(path: string): unknown {
		const match = path.match(VARIABLE_PATH_REGEX);
		if (!match) {
			return undefined;
		}

		const [, source, name] = match;

		// 系统变量
		if (source === 'sys') {
			return this.context.systemVariables[name];
		}

		// 环境变量
		if (source === 'env') {
			return this.context.environmentVariables[name];
		}

		// 循环变量
		if (source === 'loop' && this.context.loopContext) {
			switch (name) {
				case 'index':
					return this.context.loopContext.index;
				case 'item':
					return this.context.loopContext.item;
				case 'items':
					return this.context.loopContext.items;
				default:
					return undefined;
			}
		}

		// 开始节点的用户输入
		if (source === 'start') {
			return this.context.userInputs[name];
		}

		// 其他节点的输出变量
		const nodeOutputs = this.context.variables.get(source);
		if (nodeOutputs) {
			return nodeOutputs[name];
		}

		return undefined;
	}

	/**
	 * 解析模板字符串中的所有变量引用
	 * @param template 模板字符串，如 "Hello {{start.name}}, your id is {{sys.user_id}}"
	 */
	resolveTemplate(template: string): string {
		return template.replace(TEMPLATE_VARIABLE_REGEX, (match, source, name) => {
			const value = this.resolve(`${source}.${name}`);
			if (value === undefined || value === null) {
				return '';
			}
			if (typeof value === 'object') {
				return JSON.stringify(value);
			}
			return String(value);
		});
	}

	/**
	 * 解析对象中所有字符串字段的变量引用
	 */
	resolveObject<T extends Record<string, unknown>>(obj: T): T {
		const result: Record<string, unknown> = {};
		
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				result[key] = this.resolveTemplate(value);
			} else if (Array.isArray(value)) {
				result[key] = value.map(item => 
					typeof item === 'string' ? this.resolveTemplate(item) : item
				);
			} else if (value && typeof value === 'object') {
				result[key] = this.resolveObject(value as Record<string, unknown>);
			} else {
				result[key] = value;
			}
		}
		
		return result as T;
	}

	/**
	 * 获取节点的所有输入变量值
	 * @param variablePaths 变量路径数组
	 */
	resolveInputs(variablePaths: string[]): Record<string, unknown> {
		const inputs: Record<string, unknown> = {};
		
		for (const path of variablePaths) {
			const value = this.resolve(path);
			// 使用完整路径作为 key，或者只用变量名
			const name = path.split('.').pop() ?? path;
			inputs[name] = value;
		}
		
		return inputs;
	}

	/**
	 * 设置节点输出变量
	 */
	setNodeOutputs(nodeId: string, outputs: Record<string, unknown>): void {
		this.context.variables.set(nodeId, outputs);
	}

	/**
	 * 获取节点输出变量
	 */
	getNodeOutputs(nodeId: string): Record<string, unknown> | undefined {
		return this.context.variables.get(nodeId);
	}

	/**
	 * 检查变量路径是否有效
	 */
	isValidPath(path: string): boolean {
		return VARIABLE_PATH_REGEX.test(path);
	}

	/**
	 * 提取模板中的所有变量路径
	 */
	extractVariablePaths(template: string): string[] {
		const paths: string[] = [];
		let match;
		
		while ((match = TEMPLATE_VARIABLE_REGEX.exec(template)) !== null) {
			paths.push(`${match[1]}.${match[2]}`);
		}
		
		// 重置 regex lastIndex
		TEMPLATE_VARIABLE_REGEX.lastIndex = 0;
		
		return paths;
	}
}
