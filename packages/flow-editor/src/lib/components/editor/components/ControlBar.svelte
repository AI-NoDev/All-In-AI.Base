<script lang="ts">
	import Icon from '@iconify/svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { workflowState } from '../contexts/index.js';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip/index.js';
	import * as DropdownMenu from '@qiyu-allinai/ui/components/dropdown-menu/index.js';
	import * as Popover from '@qiyu-allinai/ui/components/popover/index.js';
	import NodePicker, { type NodeTemplate } from './NodePicker.svelte';
	import ELK from 'elkjs/lib/elk.bundled.js';

	type ExportFormat = 'png' | 'jpeg' | 'svg';
	type ExportScope = 'viewport' | 'full';

	const { fitView, getNodes, screenToFlowPosition } = useSvelteFlow();

	let nodePickerOpen = $state(false);
	let isLayouting = $state(false);
	
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

	// ELK 实例
	const elk = new ELK();

	// 节点尺寸常量
	const NODE_WIDTH = 240;
	const NODE_HEIGHT = 80;
	const LOOP_MIN_WIDTH = 400;
	const LOOP_MIN_HEIGHT = 220;
	// 循环节点内部布局偏移
	const LOOP_PADDING_LEFT = 76;
	const LOOP_PADDING_TOP = 74;
	const LOOP_PADDING_RIGHT = 30;
	const LOOP_PADDING_BOTTOM = 30;

	/** 使用 ELK 进行自动布局 */
	async function autoLayout() {
		if (isLayouting) return;
		isLayouting = true;

		try {
			const nodes = getNodes();
			const edges = workflowState.edges;

			// 构建 ELK 图结构
			const elkGraph = buildElkGraph(nodes, edges);
			
			console.log('ELK Graph:', JSON.stringify(elkGraph, null, 2));
			
			// 执行布局
			const layoutedGraph = await elk.layout(elkGraph);
			
			console.log('Layouted Graph:', JSON.stringify(layoutedGraph, null, 2));
			
			// 应用布局结果
			applyLayout(layoutedGraph, nodes);
			
			// 适应视图
			setTimeout(() => fitView({ padding: 0.1, duration: 300 }), 50);
		} catch (error) {
			console.error('ELK layout failed:', error);
		} finally {
			isLayouting = false;
		}
	}

	interface ElkNodeInput {
		id: string;
		width: number;
		height: number;
		children?: ElkNodeInput[];
		layoutOptions?: Record<string, string>;
	}

	interface ElkEdgeInput {
		id: string;
		sources: string[];
		targets: string[];
	}

	interface ElkGraphInput {
		id: string;
		layoutOptions: Record<string, string>;
		children: ElkNodeInput[];
		edges: ElkEdgeInput[];
	}

	/** 构建 ELK 图结构 - 简化版，让 ELK 处理所有布局 */
	function buildElkGraph(nodes: ReturnType<typeof getNodes>, edges: typeof workflowState.edges): ElkGraphInput {
		// 分离主流程节点和循环内子节点
		const mainNodes = nodes.filter(n => !n.parentId && n.type !== 'note');
		const childNodesByParent = new Map<string, typeof nodes>();
		
		nodes.filter(n => n.parentId).forEach(n => {
			if (!childNodesByParent.has(n.parentId!)) {
				childNodesByParent.set(n.parentId!, []);
			}
			childNodesByParent.get(n.parentId!)!.push(n);
		});

		// 构建 ELK 节点（简化：不使用端口，让 ELK 自动处理）
		const elkChildren: ElkNodeInput[] = mainNodes.map(node => {
			const isLoop = node.type === 'loop';
			const children = childNodesByParent.get(node.id);
			
			if (isLoop && children && children.length > 0) {
				// 循环节点：包含子节点，让 ELK 自动计算尺寸
				return {
					id: node.id,
					width: LOOP_MIN_WIDTH,
					height: LOOP_MIN_HEIGHT,
					layoutOptions: {
						'elk.algorithm': 'layered',
						'elk.direction': 'RIGHT',
						'elk.spacing.nodeNode': '20',
						'elk.layered.spacing.nodeNodeBetweenLayers': '50',
						'elk.padding': `[top=${LOOP_PADDING_TOP},left=${LOOP_PADDING_LEFT},bottom=${LOOP_PADDING_BOTTOM},right=${LOOP_PADDING_RIGHT}]`
					},
					children: children.map(child => ({
						id: child.id,
						width: NODE_WIDTH,
						height: NODE_HEIGHT
					}))
				};
			}
			
			return {
				id: node.id,
				width: node.width ?? NODE_WIDTH,
				height: node.height ?? NODE_HEIGHT
			};
		});

		// 构建 ELK 边（简化：直接使用节点 ID）
		const elkEdges: ElkEdgeInput[] = [];
		const nodeIds = new Set(nodes.map(n => n.id));

		edges.forEach(edge => {
			// 跳过无效边
			if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
			
			// 跳过 loop-entry 边（这是循环内部的入口边，需要特殊处理）
			if (edge.sourceHandle === 'loop-entry') {
				// 循环入口边：从循环节点到子节点
				// ELK 会自动处理层级边
				elkEdges.push({
					id: edge.id,
					sources: [edge.source],
					targets: [edge.target]
				});
				return;
			}
			
			elkEdges.push({
				id: edge.id,
				sources: [edge.source],
				targets: [edge.target]
			});
		});

		return {
			id: 'root',
			layoutOptions: {
				'elk.algorithm': 'layered',
				'elk.direction': 'RIGHT',
				'elk.spacing.nodeNode': '40',
				'elk.layered.spacing.nodeNodeBetweenLayers': '80',
				'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
				'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
				'elk.edgeRouting': 'ORTHOGONAL',
				'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
				// 关键：让 ELK 根据边的顺序排列节点
				'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
				'elk.layered.crossingMinimization.forceNodeModelOrder': 'true'
			},
			children: elkChildren,
			edges: elkEdges
		};
	}

	interface ElkLayoutedNode {
		id: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		children?: ElkLayoutedNode[];
	}

	interface ElkLayoutedGraph {
		children?: ElkLayoutedNode[];
	}

	/** 应用 ELK 布局结果 */
	function applyLayout(layoutedGraph: ElkLayoutedGraph, originalNodes: ReturnType<typeof getNodes>) {
		if (!layoutedGraph.children) return;

		const positionMap = new Map<string, { x: number; y: number; width?: number; height?: number }>();

		// 递归收集所有节点位置
		function collectPositions(elkNodes: ElkLayoutedNode[] | undefined) {
			elkNodes?.forEach(elkNode => {
				positionMap.set(elkNode.id, {
					x: elkNode.x ?? 0,
					y: elkNode.y ?? 0,
					width: elkNode.width,
					height: elkNode.height
				});

				// 递归处理子节点（循环内的节点）
				if (elkNode.children && elkNode.children.length > 0) {
					collectPositions(elkNode.children);
				}
			});
		}

		collectPositions(layoutedGraph.children);

		// 应用位置到 workflowState
		workflowState.nodes = workflowState.nodes.map(node => {
			if (node.type === 'note') return node; // 跳过注释节点
			
			const pos = positionMap.get(node.id);
			if (!pos) return node;

			// 循环节点：更新尺寸（同时设置 width, height, measured, style）
			if (node.type === 'loop' && pos.width && pos.height) {
				return {
					...node,
					position: { x: pos.x, y: pos.y },
					width: pos.width,
					height: pos.height,
					measured: { width: pos.width, height: pos.height },
					style: `width: ${pos.width}px; height: ${pos.height}px;`
				};
			}

			// 普通节点和子节点
			return {
				...node,
				position: { x: pos.x, y: pos.y }
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
