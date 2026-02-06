<script lang="ts">
	import Icon from '@iconify/svelte';
	import { workflowState } from '../contexts/index.js';

	interface NodeTemplate {
		type: string;
		label: string;
		icon: string;
		color: string;
		description: string;
	}

	const nodeTemplates: NodeTemplate[] = [
		{ type: 'start', label: '开始', icon: 'mdi:play-circle', color: 'bg-green-500', description: '工作流入口' },
		{ type: 'llm', label: 'LLM', icon: 'mdi:robot', color: 'bg-blue-500', description: '大语言模型调用' },
		{ type: 'knowledge', label: '知识检索', icon: 'mdi:database-search', color: 'bg-purple-500', description: '检索知识库' },
		{ type: 'agent', label: 'Agent', icon: 'mdi:robot-outline', color: 'bg-teal-500', description: '智能体调用' },
		{ type: 'classifier', label: '问题分类器', icon: 'mdi:source-branch', color: 'bg-amber-500', description: '分类路由' },
		{ type: 'output', label: '输出', icon: 'mdi:export', color: 'bg-orange-500', description: '工作流输出' },
	];

	function handleDragStart(event: DragEvent, template: NodeTemplate) {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData('application/reactflow', JSON.stringify({
			type: template.type,
			label: template.label
		}));
		event.dataTransfer.effectAllowed = 'move';
	}

	function addNode(template: NodeTemplate) {
		const id = crypto.randomUUID();
		const existingNodes = workflowState.nodes;
		const offsetX = existingNodes.length * 50;
		const offsetY = existingNodes.length * 50;

		workflowState.addNode({
			id,
			type: template.type,
			position: { x: 250 + offsetX, y: 100 + offsetY },
			data: { 
				title: template.label,
				type: template.type,
				desc: ''
			}
		});
	}
</script>

<div class="flex flex-col gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm w-48">
	<div class="text-xs font-medium text-muted-foreground px-2 py-1">节点</div>
	
	{#each nodeTemplates as template (template.type)}
		<button
			class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-left"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, template)}
			onclick={() => addNode(template)}
		>
			<div class="flex items-center justify-center w-6 h-6 rounded {template.color} text-white">
				<Icon icon={template.icon} width="14" height="14" />
			</div>
			<div class="flex flex-col">
				<span class="text-sm font-medium">{template.label}</span>
				<span class="text-xs text-muted-foreground">{template.description}</span>
			</div>
		</button>
	{/each}
</div>
