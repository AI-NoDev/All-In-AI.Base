<script lang="ts">
	import Icon from '@iconify/svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { workflowState } from '../contexts/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import NodePicker, { type NodeTemplate } from './NodePicker.svelte';

	type ExportFormat = 'png' | 'jpeg' | 'svg';
	type ExportScope = 'viewport' | 'full';

	const { fitView, getNodes, screenToFlowPosition } = useSvelteFlow();

	let nodePickerOpen = $state(false);
	
	// 使用共享的交互模式状态
	const mode = $derived(workflowState.interactionMode);
	
	function setMode(newMode: 'hand' | 'pointer') {
		workflowState.interactionMode = newMode;
	}

	/** 获取画布中心的 flow 坐标 */
	function getCanvasCenterPosition() {
		const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
		if (!flowElement) return { x: 200, y: 200 };
		
		const rect = flowElement.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		return screenToFlowPosition({ x: centerX, y: centerY });
	}

	function addNode(template: NodeTemplate, _event: MouseEvent) {
		// ControlBar 的 Popover 在画布外，使用画布中心作为初始位置
		const initialPos = getCanvasCenterPosition();
		
		// 启动拖拽放置模式
		workflowState.startPendingNode({
			type: template.type,
			label: template.label,
			icon: template.icon,
			color: template.color
		}, initialPos);
		nodePickerOpen = false;
	}

	function addNoteNode() {
		// ControlBar 的按钮在画布外，使用画布中心作为初始位置
		const initialPos = getCanvasCenterPosition();
		
		// 启动拖拽放置模式（注释节点）
		workflowState.startPendingNode({
			type: 'note',
			label: '注释',
			icon: 'mdi:note-text-outline',
			color: 'bg-yellow-500'
		}, initialPos);
	}

	function autoLayout() {
		const nodes = getNodes();
		const startNode = nodes.find(n => n.type === 'start');
		if (!startNode) return;

		const adjacency = new Map<string, string[]>();
		workflowState.edges.forEach(e => {
			if (!adjacency.has(e.source)) adjacency.set(e.source, []);
			adjacency.get(e.source)!.push(e.target);
		});

		const levels = new Map<string, number>();
		const queue = [startNode.id];
		levels.set(startNode.id, 0);

		while (queue.length > 0) {
			const current = queue.shift()!;
			const currentLevel = levels.get(current)!;
			const children = adjacency.get(current) ?? [];
			children.forEach(child => {
				if (!levels.has(child)) {
					levels.set(child, currentLevel + 1);
					queue.push(child);
				}
			});
		}

		const levelGroups = new Map<number, string[]>();
		levels.forEach((level, nodeId) => {
			if (!levelGroups.has(level)) levelGroups.set(level, []);
			levelGroups.get(level)!.push(nodeId);
		});

		const horizontalGap = 300;
		const verticalGap = 150;
		const startX = 100;
		const startY = 200;

		workflowState.nodes = workflowState.nodes.map(node => {
			const level = levels.get(node.id);
			if (level === undefined) return node;

			const nodesInLevel = levelGroups.get(level)!;
			const indexInLevel = nodesInLevel.indexOf(node.id);
			const totalInLevel = nodesInLevel.length;
			const offsetY = (indexInLevel - (totalInLevel - 1) / 2) * verticalGap;

			return {
				...node,
				position: {
					x: startX + level * horizontalGap,
					y: startY + offsetY
				}
			};
		});
	}

	async function exportImage(format: ExportFormat, scope: ExportScope) {
		const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
		if (!flowElement) return;

		try {
			// @ts-ignore - html-to-image types are bundled but TS can't resolve them in monorepo
			const { toPng, toJpeg, toSvg } = await import('html-to-image');

			const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
			const options = {
				backgroundColor: bgColor,
				quality: 0.95,
			};

			if (scope === 'full') {
				fitView({ padding: 0.1 });
				await new Promise(resolve => setTimeout(resolve, 100));
			}

			let dataUrl: string;
			switch (format) {
				case 'png':
					dataUrl = await toPng(flowElement, options);
					break;
				case 'jpeg':
					dataUrl = await toJpeg(flowElement, options);
					break;
				case 'svg':
					dataUrl = await toSvg(flowElement, options);
					break;
			}

			const link = document.createElement('a');
			link.download = `workflow-${scope}.${format}`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Failed to export image:', error);
		}
	}
</script>

<div class="absolute left-4 top-1/2 -translate-y-1/2 z-10">
	<div class="flex flex-col gap-1 p-1.5 bg-background/95 backdrop-blur-sm rounded-lg border shadow-md">
		<!-- 添加节点 -->
		<Popover.Root bind:open={nodePickerOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
						title="添加节点"
					>
						<Icon icon="mdi:plus-box-outline" class="size-5" />
					</button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content side="right" align="start" class="w-72 p-0">
				<NodePicker onSelect={addNode} />
			</Popover.Content>
		</Popover.Root>

		<!-- 添加注释 -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
						onclick={() => addNoteNode()}
					>
						<Icon icon="mdi:note-text-outline" class="size-5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="right">添加注释</Tooltip.Content>
		</Tooltip.Root>

		<div class="h-px bg-border my-1"></div>

		<!-- 指针模式 -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors {mode === 'pointer' ? 'bg-accent' : 'hover:bg-accent'}"
						onclick={() => setMode('pointer')}
					>
						<Icon icon="mdi:cursor-default-outline" class="size-5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="right">框选多选</Tooltip.Content>
		</Tooltip.Root>

		<!-- 手柄模式 -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors {mode === 'hand' ? 'bg-accent' : 'hover:bg-accent'}"
						onclick={() => setMode('hand')}
					>
						<Icon icon="mdi:hand-back-left-outline" class="size-5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="right">拖拽模式</Tooltip.Content>
		</Tooltip.Root>

		<div class="h-px bg-border my-1"></div>

		<!-- 整理节点 -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
						onclick={autoLayout}
					>
						<Icon icon="mdi:magic-staff" class="size-5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="right">整理节点</Tooltip.Content>
		</Tooltip.Root>

		<!-- 更多操作 -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props: tooltipProps })}
								<button
									{...props}
									{...tooltipProps}
									class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
								>
									<Icon icon="mdi:dots-horizontal" class="size-5" />
								</button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content side="right">更多</Tooltip.Content>
					</Tooltip.Root>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content side="right" align="end" class="w-48">
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Icon icon="mdi:monitor-screenshot" class="size-4 mr-2" />
						导出当前视图
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item onclick={() => exportImage('png', 'viewport')}>
							<Icon icon="mdi:file-image-outline" class="size-4 mr-2" />
							PNG 格式
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => exportImage('jpeg', 'viewport')}>
							<Icon icon="mdi:file-image-outline" class="size-4 mr-2" />
							JPEG 格式
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => exportImage('svg', 'viewport')}>
							<Icon icon="mdi:file-code-outline" class="size-4 mr-2" />
							SVG 格式
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Icon icon="mdi:image-outline" class="size-4 mr-2" />
						导出整个工作流
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item onclick={() => exportImage('png', 'full')}>
							<Icon icon="mdi:file-image-outline" class="size-4 mr-2" />
							PNG 格式
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => exportImage('jpeg', 'full')}>
							<Icon icon="mdi:file-image-outline" class="size-4 mr-2" />
							JPEG 格式
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => exportImage('svg', 'full')}>
							<Icon icon="mdi:file-code-outline" class="size-4 mr-2" />
							SVG 格式
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
