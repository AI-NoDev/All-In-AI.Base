<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components/ui/input';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { workflowState } from '../contexts/index.js';

	interface MenuPosition {
		x: number;
		y: number;
	}

	interface FlowPosition {
		x: number;
		y: number;
	}

	interface NodeTemplate {
		type: string;
		label: string;
		icon: string;
		color: string;
		description: string;
		category: 'node' | 'tool';
	}

	const nodeTemplates: NodeTemplate[] = [
		{ type: 'start', label: '开始', icon: 'mdi:play-circle', color: 'bg-green-500', description: '工作流入口', category: 'node' },
		{ type: 'llm', label: 'LLM', icon: 'mdi:robot', color: 'bg-blue-500', description: '大语言模型调用', category: 'node' },
		{ type: 'knowledge', label: '知识检索', icon: 'mdi:database-search', color: 'bg-purple-500', description: '检索知识库', category: 'node' },
		{ type: 'agent', label: 'Agent', icon: 'mdi:robot-outline', color: 'bg-teal-500', description: '智能体调用', category: 'node' },
		{ type: 'classifier', label: '问题分类器', icon: 'mdi:source-branch', color: 'bg-amber-500', description: '分类路由', category: 'node' },
		{ type: 'output', label: '输出', icon: 'mdi:export', color: 'bg-orange-500', description: '工作流输出', category: 'node' },
	];

	const { screenToFlowPosition } = useSvelteFlow();

	let open = $state(false);
	let showNodePicker = $state(false);
	let position = $state<MenuPosition>({ x: 0, y: 0 });
	let flowPosition = $state<FlowPosition>({ x: 0, y: 0 });
	let searchQuery = $state('');
	let activeTab = $state<'node' | 'tool'>('node');

	let filteredNodes = $derived(
		nodeTemplates.filter(n => 
			n.category === activeTab &&
			(n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			 n.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	export function show(event: MouseEvent) {
		event.preventDefault();
		position = { x: event.clientX, y: event.clientY };
		// 将屏幕坐标转换为画布坐标
		flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
		open = true;
		showNodePicker = false;
		searchQuery = '';
	}

	function close() {
		open = false;
		showNodePicker = false;
		searchQuery = '';
	}

	function openNodePicker() {
		showNodePicker = true;
	}

	function addNode(template: NodeTemplate) {
		const id = crypto.randomUUID();

		workflowState.addNode({
			id,
			type: template.type,
			position: { x: flowPosition.x, y: flowPosition.y },
			data: { 
				title: template.label,
				type: template.type,
				desc: ''
			}
		});
		close();
	}

	function handleAction(action: string) {
		if (action === 'add-node') {
			openNodePicker();
			return;
		}
		console.log('context-menu action:', action);
		close();
	}
</script>

<svelte:window onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} />

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed z-50 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
		style="left: {position.x}px; top: {position.y}px;"
		onclick={(e) => e.stopPropagation()}
		oncontextmenu={(e: MouseEvent) => e.preventDefault()}
	>
		{#if !showNodePicker}
			<!-- 主菜单 -->
			<div class="min-w-48 p-1">
				<button
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('add-node')}
				>
					<Icon icon="tdesign:add" class="size-4" />
					添加节点
					<Icon icon="mdi:chevron-right" class="size-4 ml-auto" />
				</button>
				<button
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('select-all')}
				>
					<Icon icon="tdesign:select" class="size-4" />
					全选
				</button>
				<div class="my-1 h-px bg-border"></div>
				<button
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('fit-view')}
				>
					<Icon icon="tdesign:fullscreen" class="size-4" />
					适应画布
				</button>
			</div>
		{:else}
			<!-- 节点选择器 -->
			<div class="w-72">
				<!-- Tab 切换 -->
				<div class="flex border-b">
					<button
						class="flex-1 px-4 py-2 text-sm font-medium transition-colors
							{activeTab === 'node' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}"
						onclick={() => activeTab = 'node'}
					>
						节点
					</button>
					<button
						class="flex-1 px-4 py-2 text-sm font-medium transition-colors
							{activeTab === 'tool' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}"
						onclick={() => activeTab = 'tool'}
					>
						工具节点
					</button>
				</div>

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

				<!-- 节点列表 -->
				<div class="max-h-64 overflow-y-auto p-1">
					{#if filteredNodes.length === 0}
						<div class="py-4 text-center text-sm text-muted-foreground">
							暂无匹配的节点
						</div>
					{:else}
						{#each filteredNodes as template (template.type)}
							<button
								class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent transition-colors"
								onclick={() => addNode(template)}
							>
								<div class="flex items-center justify-center w-8 h-8 rounded-lg {template.color} text-white shrink-0">
									<Icon icon={template.icon} width="16" height="16" />
								</div>
								<div class="flex flex-col min-w-0">
									<span class="text-sm font-medium truncate">{template.label}</span>
									<span class="text-xs text-muted-foreground truncate">{template.description}</span>
								</div>
							</button>
						{/each}
					{/if}
				</div>

				<!-- 返回按钮 -->
				<div class="border-t p-1">
					<button
						class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
						onclick={() => showNodePicker = false}
					>
						<Icon icon="mdi:arrow-left" class="size-4" />
						返回
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
