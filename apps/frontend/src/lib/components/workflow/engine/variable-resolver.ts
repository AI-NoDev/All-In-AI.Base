/**
 * 变量解析器 - 解析变量引用并获取值
 * 
 * 变量命名格式：
 * - input.xxx: 流程输入变量（开始节点的用户输入）
 * - sys.xxx: 系统变量
 * - env.xxx: 环境变量
 * - loop.xxx: 循环变量
 * - {nodeId}.xxx: 节点输出变量
 */
import type { ExecutionContext } from './types';

/** 变量路径格式: source.variableName（支持嵌套路径如 nodeId.usage.total） */
const VARIABLE_PATH_REGEX = /^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.]+)$/;

/** 
 * 模板变量格式: {{source.variableName}} 或 {{#source.variableName#}}
 * 注意：使用非全局正则表达式，在 replace 中会自动处理所有匹配
 */
const TEMPLATE_VARIABLE_REGEX = /\{\{#?([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.]+)#?\}\}/g;

export class VariableResolver {
	private context: ExecutionContext;

	constructor(context: ExecutionContext) {
		this.context = context;
	}

	/**
	 * 解析单个变量路径，返回值
	 * @param path 变量路径，如 "input.query" 或 "sys.user_id" 或 "env.API_KEY" 或 "llm_1.text"
	 */
	resolve(path: string): unknown {
		const match = path.match(VARIABLE_PATH_REGEX);
		if (!match) {
			console.warn('[VariableResolver] invalid path format:', path);
			return undefined;
		}

		const [, source, namePath] = match;

		// 流程输入变量（开始节点的用户输入）
		if (source === 'input') {
			return this.getNestedValue(this.context.userInputs, namePath);
		}

		// 系统变量
		if (source === 'sys') {
			return this.getNestedValue(this.context.systemVariables, namePath);
		}

		// 环境变量
		if (source === 'env') {
			return this.context.environmentVariables[namePath];
		}

		// 循环变量
		if (source === 'loop' && this.context.loopContext) {
			switch (namePath) {
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

		// 兼容旧格式：start.xxx -> input.xxx
		if (source === 'start') {
			return this.getNestedValue(this.context.userInputs, namePath);
		}

		// 其他节点的输出变量
		const nodeOutputs = this.context.variables.get(source);
		if (nodeOutputs) {
			return this.getNestedValue(nodeOutputs, namePath);
		}

		return undefined;
	}

	/**
	 * 获取嵌套对象的值
	 * @param obj 对象
	 * @param path 路径，如 "usage.total" 或 "text"
	 */
	private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
		const parts = path.split('.');
		let current: unknown = obj;

		for (const part of parts) {
			if (current === null || current === undefined) {
				return undefined;
			}
			if (typeof current !== 'object') {
				return undefined;
			}
			current = (current as Record<string, unknown>)[part];
		}

		return current;
	}

	/**
	 * 解析模板字符串中的所有变量引用
	 * @param template 模板字符串，如 "Hello {{input.name}}, your id is {{sys.user_id}}"
	 */
	resolveTemplate(template: string): string {
		return template.replace(TEMPLATE_VARIABLE_REGEX, (match, source, namePath) => {
			const fullPath = `${source}.${namePath}`;
			const value = this.resolve(fullPath);
			
			if (value === undefined || value === null) {
				// 变量未找到时返回空字符串
				console.warn('[VariableResolver] variable not found:', fullPath);
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
