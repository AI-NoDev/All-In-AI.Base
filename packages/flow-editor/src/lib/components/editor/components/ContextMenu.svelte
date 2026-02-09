<script lang="ts">
	import Icon from '@iconify/svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { workflowState } from '../contexts/index.js';
	import NodePicker, { type NodeTemplate } from './NodePicker.svelte';

	interface MenuPosition {
		x: number;
		y: number;
	}

	interface FlowPosition {
		x: number;
		y: number;
	}

	const { screenToFlowPosition, fitView } = useSvelteFlow();

	let open = $state(false);
	let showNodePicker = $state(false);
	let position = $state<MenuPosition>({ x: 0, y: 0 });
	let flowPosition = $state<FlowPosition>({ x: 0, y: 0 });

	export function show(event: MouseEvent) {
		event.preventDefault();
		position = { x: event.clientX, y: event.clientY };
		flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
		open = true;
		showNodePicker = false;
	}

	function close() {
		open = false;
		showNodePicker = false;
	}

	function addNode(template: NodeTemplate, _event: MouseEvent) {
		// 使用右键菜单打开时记录的 flow 坐标作为初始位置
		// 因为点击事件发生在菜单内部，不是画布上
		workflowState.startPendingNode({
			type: template.type,
			label: template.label,
			icon: template.icon,
			color: template.color
		}, flowPosition);
		close();
	}

	function addNoteNode() {
		// 启动拖拽放置模式（注释节点）
		workflowState.startPendingNode({
			type: 'note',
			label: '注释',
			icon: 'mdi:note-text-outline',
			color: 'bg-yellow-500'
		}, flowPosition);
		close();
	}

	function handleAction(action: string) {
		switch (action) {
			case 'add-node':
				showNodePicker = true;
				return;
			case 'add-note':
				addNoteNode();
				return;
			case 'select-all':
				workflowState.nodes = workflowState.nodes.map(n => ({ ...n, selected: true }));
				close();
				return;
			case 'fit-view':
				fitView({ padding: 0.2 });
				close();
				return;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onclick={close} onkeydown={handleKeydown} />

{#if open}
	<div
		role="menu"
		tabindex="-1"
		class="fixed z-50 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
		style="left: {position.x}px; top: {position.y}px;"
		onclick={(e) => e.stopPropagation()}
		onkeydown={handleKeydown}
		oncontextmenu={(e) => e.preventDefault()}
	>
		{#if !showNodePicker}
			<!-- 主菜单 -->
			<div class="min-w-48 p-1">
				<button
					type="button"
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('add-node')}
				>
					<Icon icon="tdesign:add" class="size-4" />
					添加节点
					<Icon icon="mdi:chevron-right" class="size-4 ml-auto" />
				</button>
				<button
					type="button"
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('add-note')}
				>
					<Icon icon="mdi:note-text" class="size-4" />
					添加注释
				</button>
				<button
					type="button"
					class="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
					onclick={() => handleAction('select-all')}
				>
					<Icon icon="tdesign:select" class="size-4" />
					全选
				</button>
				<div class="my-1 h-px bg-border"></div>
				<button
					type="button"
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
				<NodePicker onSelect={addNode} />
				<!-- 返回按钮 -->
				<div class="border-t p-1">
					<button
						type="button"
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
