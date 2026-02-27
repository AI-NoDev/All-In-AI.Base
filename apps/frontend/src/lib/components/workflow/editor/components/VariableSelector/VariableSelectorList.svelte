<script lang="ts">
	import { workflowState, START_NODE_ID } from '$lib/components/workflow/editor/contexts/index';
	import { type InputField, type StartNodeData } from '../../nodes/StartNode/types';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, VARIABLE_TYPE_LABELS, createInputVariable, createNodeOutputVariable, type Variable, type VariableGroup } from './types';
	import { Input } from '$lib/components/ui/input';
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

	interface Props {
		/** 变量选择回调 */
		onSelect?: (variable: Variable) => void;
		/** 占位符 */
		placeholder?: string;
		/** 自定义环境变量 */
		envVariables?: Variable[];
		/** 过滤的数据类型（只显示这些类型） */
		filterTypes?: VariableType[];
		/** 已选中的变量路径列表（用于多选时显示已选状态） */
		selectedPaths?: string[];
		/** 当前节点 ID（用于获取前置节点的输出变量） */
		currentNodeId?: string;
	}

	let { 
		onSelect, 
		placeholder = '搜索变量...',
		envVariables = DEFAULT_ENV_VARIABLES,
		filterTypes,
		selectedPaths = [],
		currentNodeId,
	}: Props = $props();

	let searchQuery = $state('');

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
				outputs = nodeData.errorOutputs as NodeOutputVariable[] | undefined;
				if (!outputs || outputs.length === 0) {
					if (nodeType === 'llm') {
						outputs = LLM_ERROR_OUTPUTS;
					}
				}
			} else {
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
		
		function traverse(id: string) {
			const visitKey = id;
			if (visited.has(visitKey)) return;
			visited.add(visitKey);
			
			const incomingEdges = workflowState.edges.filter(e => e.target === id);
			
			for (const edge of incomingEdges) {
				const sourceNode = workflowState.nodes.find(n => n.id === edge.source);
				if (sourceNode) {
					traverse(sourceNode.id);
					
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

	// 构建变量分组
	let variableGroups = $derived.by((): VariableGroup[] => {
		const groups: VariableGroup[] = [
			{
				id: 'flow_input',
				label: '流程输入',
				icon: 'mdi:import',
				variables: flowInputVariables,
			},
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

		let filtered = groups.filter(group => group.variables.length > 0);
		
		if (filterTypes && filterTypes.length > 0) {
			filtered = filtered.map(group => ({
				...group,
				variables: group.variables.filter(v => filterTypes.includes(v.type)),
			})).filter(group => group.variables.length > 0);
		}

		return filtered;
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
										<span class="text-xs {getTypeColor(variable.type)}">{getTypeLabel(variable.type)}</span>
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
