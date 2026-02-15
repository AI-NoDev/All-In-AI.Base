<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';

	/** 节点分组 */
	type NodeGroup = 'basic' | 'logic' | 'tool';

	export interface NodeTemplate {
		type: string;
		label: string;
		icon: string;
		color: string;
		description: string;
		category: 'node' | 'tool';
		group: NodeGroup;
	}

	interface NodeGroupConfig {
		key: NodeGroup;
		label: string;
	}

	interface Props {
		onSelect?: (template: NodeTemplate, event: MouseEvent) => void;
		showTabs?: boolean;
		class?: string;
		/** 要排除的节点类型列表 */
		excludeTypes?: string[];
		/** 是否在循环内（显示退出循环节点） */
		inLoop?: boolean;
	}

	const { onSelect, showTabs = true, class: className = '', excludeTypes = [], inLoop = false }: Props = $props();

	const nodeGroups: NodeGroupConfig[] = [
		{ key: 'basic', label: '基础' },
		{ key: 'logic', label: '逻辑' },
		{ key: 'tool', label: '工具' },
	];

	const nodeTemplates: NodeTemplate[] = [
		// 基础节点
		{ type: 'llm', label: 'LLM', icon: 'mdi:robot', color: 'bg-blue-500', description: '大语言模型调用', category: 'node', group: 'basic' },
		{ type: 'knowledge', label: '知识检索', icon: 'mdi:database-search', color: 'bg-purple-500', description: '检索知识库', category: 'node', group: 'basic' },
		{ type: 'agent', label: 'Agent', icon: 'mdi:robot-outline', color: 'bg-teal-500', description: '智能体调用', category: 'node', group: 'basic' },
		{ type: 'output', label: '输出', icon: 'mdi:export', color: 'bg-orange-500', description: '工作流输出', category: 'node', group: 'basic' },
		
		// 逻辑节点
		{ type: 'classifier', label: '问题分类器', icon: 'mdi:tag-multiple', color: 'bg-amber-500', description: 'LLM 分类路由', category: 'node', group: 'logic' },
		{ type: 'if', label: '条件分支', icon: 'mdi:source-branch', color: 'bg-cyan-500', description: 'IF/ELIF/ELSE', category: 'node', group: 'logic' },
		{ type: 'loop', label: '循环', icon: 'mdi:infinity', color: 'bg-pink-500', description: '迭代执行', category: 'node', group: 'logic' },
		
		// 工具节点（预留）
	];
	
	// 循环内专用节点
	const loopSpecialNodes: NodeTemplate[] = [
		{ type: 'loop-break', label: '退出循环', icon: 'mdi:exit-run', color: 'bg-red-500', description: '提前退出循环', category: 'node', group: 'logic' },
	];
	
	// 合并节点列表
	let allNodeTemplates = $derived(
		inLoop ? [...loopSpecialNodes, ...nodeTemplates] : nodeTemplates
	);

	let searchQuery = $state('');
	let activeTab = $state<'node' | 'tool'>('node');

	// 过滤后的节点
	let filteredNodes = $derived(
		allNodeTemplates.filter(n =>
			n.category === activeTab &&
			!excludeTypes.includes(n.type) &&
			(n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
				n.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// 按分组组织过滤后的节点
	let groupedFilteredNodes = $derived(
		nodeGroups.map(group => ({
			...group,
			nodes: filteredNodes.filter(n => n.group === group.key)
		})).filter(g => g.nodes.length > 0)
	);

	// 检查节点是否可用（所有节点都已启用）
	function isNodeDisabled(_type: string): boolean {
		return false;
	}

	function handleSelect(template: NodeTemplate, event: MouseEvent) {
		if (isNodeDisabled(template.type)) return;
		onSelect?.(template, event);
		searchQuery = '';
	}

	export function reset() {
		searchQuery = '';
		activeTab = 'node';
	}
</script>

<div class="flex flex-col {className}">
	{#if showTabs}
		<Tabs.Root bind:value={activeTab} class="w-full">
			<Tabs.List class="w-full grid grid-cols-2 h-9">
				<Tabs.Trigger value="node" class="text-xs">节点</Tabs.Trigger>
				<Tabs.Trigger value="tool" class="text-xs">工具节点</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/if}

	<!-- 搜索框 -->
	<div class="p-2 border-b">
		<div class="relative">
			<Icon icon="mdi:magnify" class="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
			<Input
				type="text"
				placeholder="搜索节点..."
				class="pl-8 h-8 text-sm"
				bind:value={searchQuery}
			/>
		</div>
	</div>

	<!-- 节点列表（按分组） -->
	<div class="max-h-72 overflow-y-auto p-1">
		{#if groupedFilteredNodes.length === 0}
			<div class="py-4 text-center text-sm text-muted-foreground">
				暂无匹配的节点
			</div>
		{:else}
			{#each groupedFilteredNodes as group (group.key)}
				<!-- 分组标题 -->
				<div class="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-popover">
					{group.label}
				</div>
				
				<!-- 分组节点 -->
				{#each group.nodes as template (template.type)}
					<button
						type="button"
						class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors
							{isNodeDisabled(template.type) 
								? 'opacity-50 cursor-not-allowed' 
								: 'hover:bg-accent'}"
						onclick={(e) => handleSelect(template, e)}
						disabled={isNodeDisabled(template.type)}
					>
						<div class="flex items-center justify-center w-8 h-8 rounded-lg {template.color} text-white shrink-0">
							<Icon icon={template.icon} width="16" height="16" />
						</div>
						<div class="flex flex-col min-w-0">
							<div class="flex items-center gap-1">
								<span class="text-sm font-medium truncate">{template.label}</span>
								{#if isNodeDisabled(template.type)}
									<span class="text-[10px] text-muted-foreground bg-muted px-1 rounded">即将推出</span>
								{/if}
							</div>
							<span class="text-xs text-muted-foreground truncate">{template.description}</span>
						</div>
					</button>
				{/each}
			{/each}
		{/if}
	</div>
</div>
