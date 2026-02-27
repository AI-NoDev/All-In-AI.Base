<script lang="ts">
	import { workflowState, START_NODE_ID } from '$lib/components/workflow/editor/contexts/index';
	import { type InputField, type StartNodeData } from '../../nodes/StartNode/types';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, VARIABLE_TYPE_LABELS, createInputVariable, createNodeOutputVariable, type Variable, type VariableGroup } from './types';
	import * as Select from '$lib/components/ui/select';
	import Icon from '@iconify/svelte';
	import type { VariableType } from '$lib/components/workflow/types/workflow';
	import { LLM_DEFAULT_OUTPUTS, LLM_ERROR_OUTPUTS, type NodeOutputVariable } from '../../nodes/LLMNode/types';
	import { CLASSIFIER_DEFAULT_OUTPUTS } from '../../nodes/ClassifierNode/types';
	import { AGENT_DEFAULT_OUTPUTS } from '../../nodes/AgentNode/types';

	/** 前置节点信息（包含连接的 sourceHandle） */
	interface PredecessorInfo {
		node: typeof workflowState.nodes[0];
		sourceHandle: string | undefined;
	}

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
		filterTypes?: VariableType[];
		/** 自定义类名 */
		class?: string;
		/** 当前节点 ID（用于获取前置节点的输出变量） */
		currentNodeId?: string;
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
		currentNodeId,
	}: Props = $props();

	// 从开始节点获取流程输入变量（使用 input.xxx 格式）
	let flowInputVariables = $derived.by(() => {
		const startNode = workflowState.getNode(START_NODE_ID);
		if (!startNode) return [];

		const data = startNode.data as StartNodeData;
		const inputs = data.inputs ?? [];

		return inputs
			.filter((field: InputField) => !field.hidden)
			.map((field: InputField): Variable => 
				createInputVariable(
					field.variable,
					field.label,
					field.type,
					field.description ?? field.placeholder
				)
			);
	});

	// 根据节点类型和 sourceHandle 获取默认输出变量
	function getDefaultOutputsForNodeType(nodeType: string, sourceHandle: string | undefined): NodeOutputVariable[] {
		// 检查是否是错误输出引脚
		const isErrorHandle = sourceHandle === 'error' || sourceHandle === 'source-error' || sourceHandle === 'exception';
		
		switch (nodeType) {
			case 'llm': 
				return isErrorHandle ? LLM_ERROR_OUTPUTS : LLM_DEFAULT_OUTPUTS;
			case 'classifier': 
				return CLASSIFIER_DEFAULT_OUTPUTS;
			case 'agent':
				return AGENT_DEFAULT_OUTPUTS;
			default: 
				return [];
		}
	}

	// 获取前置节点的输出变量
	let predecessorOutputVariables = $derived.by((): VariableGroup[] => {
		if (!currentNodeId) return [];
		
		const predecessors = getPredecessorNodesWithHandle(currentNodeId);
		const groups: VariableGroup[] = [];
		
		for (const { node, sourceHandle } of predecessors) {
			// 跳过开始节点（已在流程输入中处理）
			if (node.id === START_NODE_ID) continue;
			
			const nodeData = node.data as Record<string, unknown>;
			const nodeType = node.type as string;
			
			// 检查是否是错误输出引脚
			const isErrorHandle = sourceHandle === 'error' || sourceHandle === 'source-error' || sourceHandle === 'exception';
			
			// 根据 sourceHandle 选择正确的输出变量
			let outputs: NodeOutputVariable[] | undefined;
			
			if (isErrorHandle) {
				// 错误输出引脚：使用 errorOutputs
				outputs = nodeData.errorOutputs as NodeOutputVariable[] | undefined;
				if (!outputs || outputs.length === 0) {
					// 使用默认错误输出
					if (nodeType === 'llm') {
						outputs = LLM_ERROR_OUTPUTS;
					}
				}
			} else {
				// 正常输出引脚：使用 outputs
				outputs = nodeData.outputs as NodeOutputVariable[] | undefined;
				if (!outputs || outputs.length === 0) {
					outputs = getDefaultOutputsForNodeType(nodeType, sourceHandle);
				}
			}
			
			if (outputs && outputs.length > 0) {
				const nodeTitle = (nodeData.title as string) || node.id;
				const groupLabel = isErrorHandle ? `${nodeTitle} (异常)` : nodeTitle;
				
				groups.push({
					id: `node_${node.id}_${sourceHandle || 'default'}`,
					label: groupLabel,
					icon: isErrorHandle ? 'mdi:alert-circle' : getNodeIcon(nodeType),
					variables: outputs.map(output => 
						createNodeOutputVariable(
							node.id,
							output.path,
							output.label,
							output.type,
							output.description
						)
					),
				});
			}
		}
		
		return groups;
	});

	// 获取前置节点（通过边的连接关系，包含 sourceHandle 信息）
	function getPredecessorNodesWithHandle(nodeId: string): PredecessorInfo[] {
		const visited = new Set<string>();
		const result: PredecessorInfo[] = [];
		
		function traverse(id: string, incomingHandle?: string) {
			const visitKey = `${id}_${incomingHandle || 'default'}`;
			if (visited.has(visitKey)) return;
			visited.add(visitKey);
			
			// 找到所有指向当前节点的边
			const incomingEdges = workflowState.edges.filter(e => e.target === id);
			
			for (const edge of incomingEdges) {
				const sourceNode = workflowState.nodes.find(n => n.id === edge.source);
				if (sourceNode) {
					// 递归遍历，但不传递 sourceHandle（只有直接连接的才需要）
					traverse(sourceNode.id, undefined);
					
					// 添加到结果，记录 sourceHandle
					const existingIndex = result.findIndex(
						p => p.node.id === sourceNode.id && p.sourceHandle === edge.sourceHandle
					);
					if (existingIndex === -1) {
						result.push({
							node: sourceNode,
							sourceHandle: edge.sourceHandle,
						});
					}
				}
			}
		}
		
		traverse(nodeId);
		return result;
	}

	// 根据节点类型获取图标
	function getNodeIcon(type: string): string {
		switch (type) {
			case 'llm': return 'mdi:robot';
			case 'code': return 'mdi:code-braces';
			case 'http': return 'mdi:web';
			case 'if': return 'mdi:source-branch';
			case 'loop': return 'mdi:repeat';
			case 'tool': return 'mdi:tools';
			case 'knowledge': return 'mdi:book-open-variant';
			case 'variable': return 'mdi:variable';
			case 'classifier': return 'mdi:tag-multiple';
			case 'agent': return 'mdi:account-cog';
			default: return 'mdi:cube-outline';
		}
	}

	// 构建变量分组（只显示有变量的分组）
	let variableGroups = $derived.by((): VariableGroup[] => {
		const groups: VariableGroup[] = [
			{
				id: 'flow_input',
				label: '流程输入',
				icon: 'mdi:import',
				variables: flowInputVariables,
			},
			// 插入前置节点输出变量
			...predecessorOutputVariables,
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

		// 过滤空分组和类型
		let filtered = groups.filter(group => group.variables.length > 0);
		
		if (filterTypes && filterTypes.length > 0) {
			filtered = filtered.map(group => ({
				...group,
				variables: group.variables.filter(v => filterTypes.includes(v.type)),
			})).filter(group => group.variables.length > 0);
		}

		return filtered;
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

	function getTypeColor(type: VariableType): string {
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			case 'file': return 'text-purple-600 dark:text-purple-400';
			case 'file-list': return 'text-purple-600 dark:text-purple-400';
			case 'array-string': return 'text-teal-600 dark:text-teal-400';
			case 'array-number': return 'text-cyan-600 dark:text-cyan-400';
			case 'array-object': return 'text-orange-600 dark:text-orange-400';
			default: return 'text-muted-foreground';
		}
	}

	function getTypeLabel(type: VariableType): string {
		return VARIABLE_TYPE_LABELS[type] ?? type;
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
								<span class="text-xs ml-auto {getTypeColor(variable.type)}">{getTypeLabel(variable.type)}</span>
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
								<span class="text-xs ml-auto {getTypeColor(variable.type)}">{getTypeLabel(variable.type)}</span>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
{/if}
