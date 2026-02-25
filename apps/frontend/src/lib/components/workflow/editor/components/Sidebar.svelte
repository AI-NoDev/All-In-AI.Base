<script lang="ts">
	import Icon from '@iconify/svelte';
	import { workflowState } from '../contexts/index';

	/** 节点分组 */
	type NodeGroup = 'basic' | 'logic' | 'tool';

	interface NodeTemplate {
		type: string;
		label: string;
		icon: string;
		color: string;
		description: string;
		group: NodeGroup;
	}

	interface NodeGroupConfig {
		key: NodeGroup;
		label: string;
		icon: string;
	}

	const nodeGroups: NodeGroupConfig[] = [
		{ key: 'basic', label: '基础', icon: 'mdi:cube-outline' },
		{ key: 'logic', label: '逻辑', icon: 'mdi:source-branch' },
		{ key: 'tool', label: '工具', icon: 'mdi:tools' },
	];

	const nodeTemplates: NodeTemplate[] = [
		// 基础节点
		{ type: 'start', label: '开始', icon: 'mdi:play-circle', color: 'bg-green-500', description: '工作流入口', group: 'basic' },
		{ type: 'llm', label: 'LLM', icon: 'mdi:robot', color: 'bg-blue-500', description: '大语言模型调用', group: 'basic' },
		{ type: 'knowledge', label: '知识检索', icon: 'mdi:database-search', color: 'bg-purple-500', description: '检索知识库', group: 'basic' },
		{ type: 'agent', label: 'Agent', icon: 'mdi:robot-outline', color: 'bg-teal-500', description: '智能体调用', group: 'basic' },
		{ type: 'output', label: '输出', icon: 'mdi:export', color: 'bg-orange-500', description: '工作流输出', group: 'basic' },
		
		// 逻辑节点
		{ type: 'classifier', label: '问题分类器', icon: 'mdi:tag-multiple', color: 'bg-amber-500', description: 'LLM 分类路由', group: 'logic' },
		{ type: 'if', label: '条件分支', icon: 'mdi:source-branch', color: 'bg-cyan-500', description: 'IF/ELIF/ELSE', group: 'logic' },
		{ type: 'loop', label: '循环', icon: 'mdi:infinity', color: 'bg-pink-500', description: '迭代执行', group: 'logic' },
		
		// 工具节点（预留）
	];

	// 按分组组织节点
	let groupedNodes = $derived(
		nodeGroups.map(group => ({
			...group,
			nodes: nodeTemplates.filter(n => n.group === group.key)
		})).filter(g => g.nodes.length > 0)
	);

	// 展开状态
	let expandedGroups = $state<Set<NodeGroup>>(new Set(['basic', 'logic']));

	function toggleGroup(group: NodeGroup) {
		const newSet = new Set(expandedGroups);
		if (newSet.has(group)) {
			newSet.delete(group);
		} else {
			newSet.add(group);
		}
		expandedGroups = newSet;
	}

	function handleDragStart(event: DragEvent, template: NodeTemplate) {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData('application/reactflow', JSON.stringify({
			type: template.type,
			label: template.label
		}));
		event.dataTransfer.effectAllowed = 'move';
	}

	function addNode(template: NodeTemplate) {
		const existingNodes = workflowState.nodes;
		const offsetX = existingNodes.length * 50;
		const offsetY = existingNodes.length * 50;
		
		// 使用 startPendingNode 创建节点，确保使用正确的默认数据结构
		workflowState.startPendingNode(
			{
				type: template.type,
				label: template.label,
				icon: template.icon,
				color: template.color
			},
			{ x: 250 + offsetX, y: 100 + offsetY }
		);
		// 立即确认放置
		workflowState.confirmPendingNode();
	}

	// 检查节点是否可用（所有节点都已启用）
	function isNodeDisabled(_type: string): boolean {
		return false;
	}
</script>

<div class="flex flex-col gap-1 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm w-52">
	{#each groupedNodes as group (group.key)}
		<!-- 分组标题 -->
		<button
			class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors text-left w-full"
			onclick={() => toggleGroup(group.key)}
		>
			<Icon 
				icon={expandedGroups.has(group.key) ? 'mdi:chevron-down' : 'mdi:chevron-right'} 
				class="w-4 h-4 text-muted-foreground shrink-0" 
			/>
			<Icon icon={group.icon} class="w-4 h-4 text-muted-foreground shrink-0" />
			<span class="text-xs font-medium text-muted-foreground">{group.label}</span>
			<span class="text-xs text-muted-foreground/60 ml-auto">{group.nodes.length}</span>
		</button>

		<!-- 分组内容 -->
		{#if expandedGroups.has(group.key)}
			<div class="ml-2 space-y-0.5">
				{#each group.nodes as template (template.type)}
					<button
						class="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left w-full
							{isNodeDisabled(template.type) 
								? 'opacity-50 cursor-not-allowed' 
								: 'hover:bg-accent'}"
						draggable={!isNodeDisabled(template.type)}
						ondragstart={(e) => !isNodeDisabled(template.type) && handleDragStart(e, template)}
						onclick={() => !isNodeDisabled(template.type) && addNode(template)}
						disabled={isNodeDisabled(template.type)}
					>
						<div class="flex items-center justify-center w-6 h-6 rounded {template.color} text-white shrink-0">
							<Icon icon={template.icon} width="14" height="14" />
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
			</div>
		{/if}
	{/each}
</div>
