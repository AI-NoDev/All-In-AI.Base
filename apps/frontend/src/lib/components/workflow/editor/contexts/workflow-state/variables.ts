import type { Variable, EnvironmentVariable } from '$lib/components/workflow/types/index';
import type { InputVariable } from './types';
import { BUILTIN_INPUT_VARIABLES } from './types';

/** 变量操作方法 */
export function createVariableOperations(
	getVariables: () => Variable[],
	setVariables: (variables: Variable[]) => void,
	getInputVariables: () => InputVariable[],
	setInputVariables: (variables: InputVariable[]) => void,
	getEnvironmentVariables: () => EnvironmentVariable[],
	setEnvironmentVariables: (variables: EnvironmentVariable[]) => void
) {
	return {
		// ===== 通用变量操作 =====
		addVariable(variable: Variable) {
			setVariables([...getVariables(), variable]);
		},
		
		getVariable(id: string) {
			return getVariables().find(v => v.id === id);
		},
		
		removeVariable(id: string) {
			setVariables(getVariables().filter(v => v.id !== id));
		},

		// ===== 输入变量操作 =====
		/** 获取所有输入变量（包括内置） */
		getAllInputVariables(): InputVariable[] {
			return [...BUILTIN_INPUT_VARIABLES, ...getInputVariables()];
		},

		/** 添加输入变量 */
		addInputVariable(variable: InputVariable) {
			setInputVariables([...getInputVariables(), variable]);
		},

		/** 更新输入变量 */
		updateInputVariable(id: string, data: Partial<InputVariable>) {
			setInputVariables(getInputVariables().map(v => v.id === id ? { ...v, ...data } : v));
		},

		/** 删除输入变量 */
		removeInputVariable(id: string) {
			// 不能删除内置变量
			if (BUILTIN_INPUT_VARIABLES.some(v => v.id === id)) return;
			setInputVariables(getInputVariables().filter(v => v.id !== id));
		},

		/** 检查输入变量名是否已存在 */
		isInputVariableNameTaken(name: string, excludeId?: string): boolean {
			const all = [...BUILTIN_INPUT_VARIABLES, ...getInputVariables()];
			return all.some(v => v.name === name && v.id !== excludeId);
		},

		// ===== 环境变量操作 =====
		/** 添加环境变量 */
		addEnvironmentVariable(variable: EnvironmentVariable) {
			setEnvironmentVariables([...getEnvironmentVariables(), variable]);
		},

		/** 更新环境变量 */
		updateEnvironmentVariable(id: string, data: Partial<EnvironmentVariable>) {
			setEnvironmentVariables(getEnvironmentVariables().map(v => v.id === id ? { ...v, ...data } : v));
		},

		/** 删除环境变量 */
		removeEnvironmentVariable(id: string) {
			setEnvironmentVariables(getEnvironmentVariables().filter(v => v.id !== id));
		},

		/** 检查环境变量名是否已存在 */
		isEnvVariableNameTaken(name: string, excludeId?: string): boolean {
			return getEnvironmentVariables().some(v => v.name === name && v.id !== excludeId);
		}
	};
}
