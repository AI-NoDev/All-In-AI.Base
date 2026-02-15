<script lang="ts">
	import { workflowState, START_NODE_ID } from '$lib/components/editor/contexts/index.js';
	import { FIELD_TYPE_DATA_TYPES, type InputField, type StartNodeData } from '../../nodes/StartNode/types.js';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, type Variable, type VariableGroup } from './types.js';
	import { Input } from '@qiyu-allinai/ui/components/input';
	import Icon from '@iconify/svelte';

	interface Props {
		/** 变量选择回调 */
		onSelect?: (variable: Variable) => void;
		/** 占位符 */
		placeholder?: string;
		/** 自定义环境变量 */
		envVariables?: Variable[];
		/** 过滤的数据类型（只显示这些类型） */
		filterTypes?: string[];
		/** 已选中的变量路径列表（用于多选时显示已选状态） */
		selectedPaths?: string[];
	}

	let { 
		onSelect, 
		placeholder = '搜索变量...',
		envVariables = DEFAULT_ENV_VARIABLES,
		filterTypes,
		selectedPaths = [],
	}: Props = $props();

	let searchQuery = $state('');

	// 从开始节点获取用户输入字段
	let userInputVariables = $derived.by(() => {
		const startNode = workflowState.getNode(START_NODE_ID);
		if (!startNode) return [];
		
		const data = startNode.data as StartNodeData;
		const inputs = data.inputs ?? [];
		
		return inputs
			.filter((field: InputField) => !field.hidden)
			.map((field: InputField): Variable => ({
				path: `start.${field.variable}`,
				label: field.label,
				type: FIELD_TYPE_DATA_TYPES[field.type] as Variable['type'],
				description: field.placeholder,
			}));
	});

	// 构建变量分组
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
			return groups.map(group => ({
				...group,
				variables: group.variables.filter(v => filterTypes.includes(v.type)),
			})).filter(group => group.variables.length > 0);
		}

		return groups;
	});

	// 搜索过滤后的分组
	let filteredGroups = $derived.by(() => {
		if (!searchQuery.trim()) return variableGroups;
		
		const query = searchQuery.toLowerCase();
		return variableGroups
			.map(group => ({
				...group,
				variables: group.variables.filter(v => 
					v.path.toLowerCase().includes(query) ||
					v.label.toLowerCase().includes(query) ||
					v.description?.toLowerCase().includes(query)
				),
			}))
			.filter(group => group.variables.length > 0);
	});

	function handleSelect(variable: Variable) {
		onSelect?.(variable);
		searchQuery = '';
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'String': return 'text-emerald-600 dark:text-emerald-400';
			case 'Number': return 'text-blue-600 dark:text-blue-400';
			case 'Boolean': return 'text-amber-600 dark:text-amber-400';
			case 'Object': return 'text-rose-600 dark:text-rose-400';
			case 'File': return 'text-purple-600 dark:text-purple-400';
			case 'Array<File>': return 'text-purple-600 dark:text-purple-400';
			default: return 'text-muted-foreground';
		}
	}

	function isSelected(path: string): boolean {
		return selectedPaths.includes(path);
	}
</script>

<div class="w-full">
	<!-- 搜索框 -->
	<div class="p-2 border-b border-border">
		<div class="relative">
			<Icon icon="mdi:magnify" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
			<Input 
				bind:value={searchQuery}
				{placeholder}
				class="h-8 pl-8 text-sm"
			/>
		</div>
	</div>

	<!-- 变量列表 -->
	<div class="h-64 overflow-y-auto">
		<div class="p-1">
			{#each filteredGroups as group (group.id)}
				<div class="mb-2">
					<!-- 分组标题 -->
					<div class="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
						<Icon icon={group.icon} class="w-4 h-4" />
						<span>{group.label}</span>
						<span class="ml-auto text-xs opacity-60">{group.variables.length}</span>
					</div>
					<!-- 变量列表 -->
					<div class="space-y-0.5">
						{#each group.variables as variable (variable.path)}
							{@const selected = isSelected(variable.path)}
							<button
								class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-muted transition-colors {selected ? 'bg-muted/50' : ''}"
								onclick={() => handleSelect(variable)}
								disabled={selected}
							>
								<Icon icon="mdi:variable" class="w-4 h-4 text-muted-foreground shrink-0" />
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2">
										<span class="text-sm font-mono truncate">{variable.path}</span>
										<span class="text-xs {getTypeColor(variable.type)}">{variable.type}</span>
									</div>
									{#if variable.description}
										<p class="text-xs text-muted-foreground truncate">{variable.description}</p>
									{/if}
								</div>
								{#if selected}
									<Icon icon="mdi:check" class="w-4 h-4 text-primary shrink-0" />
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-muted-foreground">
					<Icon icon="mdi:variable-box" class="w-10 h-10 mx-auto mb-2 opacity-50" />
					<p class="text-sm">未找到匹配的变量</p>
				</div>
			{/each}
		</div>
	</div>
</div>
