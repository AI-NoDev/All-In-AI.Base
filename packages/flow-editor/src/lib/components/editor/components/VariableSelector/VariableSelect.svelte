<script lang="ts">
	import { workflowState, START_NODE_ID } from '$lib/components/editor/contexts/index.js';
	import { FIELD_TYPE_DATA_TYPES, type InputField, type StartNodeData } from '../../nodes/StartNode/types.js';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, type Variable, type VariableGroup } from './types.js';
	import * as Select from '$lib/components/ui/select';
	import Icon from '@iconify/svelte';

	type SingleProps = {
		/** 单选模式 */
		multiple?: false;
		/** 选中的变量路径 */
		value?: string;
		/** 变量选择回调 */
		onValueChange?: (value: string | undefined) => void;
	};

	type MultipleProps = {
		/** 多选模式 */
		multiple: true;
		/** 选中的变量路径列表 */
		value?: string[];
		/** 变量选择回调 */
		onValueChange?: (value: string[]) => void;
	};

	type BaseProps = {
		/** 占位符 */
		placeholder?: string;
		/** 是否禁用 */
		disabled?: boolean;
		/** 自定义环境变量 */
		envVariables?: Variable[];
		/** 过滤的数据类型（只显示这些类型） */
		filterTypes?: string[];
		/** 自定义类名 */
		class?: string;
	};

	type Props = BaseProps & (SingleProps | MultipleProps);

	let {
		multiple = false,
		value = multiple ? [] : undefined,
		onValueChange,
		placeholder = '选择变量',
		disabled = false,
		envVariables = DEFAULT_ENV_VARIABLES,
		filterTypes,
		class: className = '',
	}: Props = $props();

	// 从开始节点获取用户输入字段
	let userInputVariables = $derived.by(() => {
		const startNode = workflowState.getNode(START_NODE_ID);
		if (!startNode) return [];

		const data = startNode.data as StartNodeData;
		const inputs = data.inputs ?? [];

		return inputs
			.filter((field: InputField) => !field.hidden)
			.map(
				(field: InputField): Variable => ({
					path: `start.${field.variable}`,
					label: field.label,
					type: FIELD_TYPE_DATA_TYPES[field.type] as Variable['type'],
					description: field.placeholder,
				})
			);
	});

	// 构建变量分组（只显示有变量的分组）
	let variableGroups = $derived.by((): VariableGroup[] => {
		const groups: VariableGroup[] = [
			{
				id: 'user_input',
				label: '用户输入',
				icon: 'mdi:form-textbox',
				variables: userInputVariables,
			},
			{
				id: 'env',
				label: '环境变量',
				icon: 'mdi:cog',
				variables: envVariables,
			},
			{
				id: 'system',
				label: '系统变量',
				icon: 'mdi:chip',
				variables: SYSTEM_VARIABLES,
			},
		];

		// 过滤类型
		if (filterTypes && filterTypes.length > 0) {
			return groups
				.map((group) => ({
					...group,
					variables: group.variables.filter((v) => filterTypes.includes(v.type)),
				}))
				.filter((group) => group.variables.length > 0);
		}

		// 只返回有变量的分组
		return groups.filter((group) => group.variables.length > 0);
	});

	// 所有变量的扁平列表（用于查找）
	let allVariables = $derived.by(() => {
		return variableGroups.flatMap((g) => g.variables);
	});

	// 获取变量信息
	function getVariable(path: string): Variable | undefined {
		return allVariables.find((v) => v.path === path);
	}

	// 显示文本（优先显示 label，没有则显示 path）
	let displayText = $derived.by(() => {
		if (multiple) {
			const paths = value as string[];
			if (!paths || paths.length === 0) return placeholder;
			if (paths.length === 1) {
				const v = getVariable(paths[0]);
				return v?.label || v?.path || paths[0];
			}
			return `已选择 ${paths.length} 个变量`;
		} else {
			const path = value as string | undefined;
			if (!path) return placeholder;
			const v = getVariable(path);
			return v?.label || v?.path || path;
		}
	});

	// 是否有选中值
	let hasValue = $derived.by(() => {
		if (multiple) {
			return (value as string[])?.length > 0;
		}
		return !!value;
	});

	function getTypeColor(type: string): string {
		switch (type) {
			case 'String':
				return 'text-emerald-600 dark:text-emerald-400';
			case 'Number':
				return 'text-blue-600 dark:text-blue-400';
			case 'Boolean':
				return 'text-amber-600 dark:text-amber-400';
			case 'Object':
				return 'text-rose-600 dark:text-rose-400';
			case 'File':
				return 'text-purple-600 dark:text-purple-400';
			case 'Array<File>':
				return 'text-purple-600 dark:text-purple-400';
			default:
				return 'text-muted-foreground';
		}
	}

	function handleValueChange(newValue: string | string[] | undefined) {
		if (multiple) {
			(onValueChange as ((v: string[]) => void) | undefined)?.(newValue as string[] ?? []);
		} else {
			(onValueChange as ((v: string | undefined) => void) | undefined)?.(newValue as string | undefined);
		}
	}
</script>

{#if multiple}
	<Select.Root
		type="multiple"
		value={value as string[]}
		onValueChange={handleValueChange}
		{disabled}
	>
		<Select.Trigger class="h-9 w-full {className}" {disabled}>
			<div class="flex items-center gap-2 truncate">
				<Icon icon="mdi:code-braces" class="w-4 h-4 shrink-0 {hasValue ? 'text-primary' : 'text-muted-foreground'}" />
				<span class={hasValue ? '' : 'text-muted-foreground'}>{displayText}</span>
			</div>
		</Select.Trigger>
		<Select.Content class="min-w-[280px] max-h-80">
			{#each variableGroups as group (group.id)}
				<Select.Group>
					<Select.GroupHeading class="flex items-center gap-2 text-xs">
						<Icon icon={group.icon} class="w-4 h-4" />
						<span>{group.label}</span>
					</Select.GroupHeading>
					{#each group.variables as variable (variable.path)}
						<Select.Item value={variable.path} label={variable.path}>
							<div class="flex items-center gap-2 w-full">
								<Icon icon="mdi:variable" class="w-4 h-4 text-muted-foreground shrink-0" />
								<span class="font-mono text-sm truncate">{variable.path}</span>
								<span class="text-xs ml-auto {getTypeColor(variable.type)}">{variable.type}</span>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
{:else}
	<Select.Root
		type="single"
		value={value as string | undefined}
		onValueChange={handleValueChange}
		{disabled}
	>
		<Select.Trigger class="h-9 w-full {className}" {disabled}>
			<div class="flex items-center gap-2 truncate">
				<Icon icon="mdi:code-braces" class="w-4 h-4 shrink-0 {hasValue ? 'text-primary' : 'text-muted-foreground'}" />
				<span class={hasValue ? '' : 'text-muted-foreground'}>{displayText}</span>
			</div>
		</Select.Trigger>
		<Select.Content class="min-w-[280px] max-h-80">
			{#each variableGroups as group (group.id)}
				<Select.Group>
					<Select.GroupHeading class="flex items-center gap-2 text-xs">
						<Icon icon={group.icon} class="w-4 h-4" />
						<span>{group.label}</span>
					</Select.GroupHeading>
					{#each group.variables as variable (variable.path)}
						<Select.Item value={variable.path} label={variable.path}>
							<div class="flex items-center gap-2 w-full">
								<Icon icon="mdi:variable" class="w-4 h-4 text-muted-foreground shrink-0" />
								<span class="font-mono text-sm truncate">{variable.path}</span>
								<span class="text-xs ml-auto {getTypeColor(variable.type)}">{variable.type}</span>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
{/if}
