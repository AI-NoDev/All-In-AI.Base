<script lang="ts">
	import { workflowState, configPanelRegistry } from '$lib/components/editor/contexts/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Resizable from '$lib/components/ui/resizable';
	import Icon from '@iconify/svelte';
	import MiniMapPanel from './MiniMap/MiniMapPanel.svelte';

	// 面板宽度状态（像素）
	const MIN_WIDTH = 320;
	const MAX_WIDTH = 800;
	const DEFAULT_WIDTH = 400;
	let panelWidth = $state(DEFAULT_WIDTH);

	// 节点类型配置
	interface NodeTypeConfig {
		icon: string;
		color: string;
		label: string;
	}

	const nodeTypeConfigs: Record<string, NodeTypeConfig> = {
		start: { icon: 'material-symbols:play-arrow', color: 'bg-green-500', label: '开始' },
		llm: { icon: 'mdi:robot', color: 'bg-blue-500', label: 'LLM' },
		knowledge: { icon: 'mdi:database-search', color: 'bg-purple-500', label: '知识检索' },
		agent: { icon: 'mdi:robot-outline', color: 'bg-teal-500', label: 'Agent' },
		classifier: { icon: 'mdi:source-branch', color: 'bg-amber-500', label: '问题分类器' },
		output: { icon: 'mdi:export', color: 'bg-orange-500', label: '输出' },
	};

	// 获取选中节点的数据
	let selectedNode = $derived.by(() => {
		const nodeId = configPanelRegistry.selectedNodeId;
		if (!nodeId) return null;
		return workflowState.nodes.find(n => n.id === nodeId) ?? null;
	});

	// 获取对应的配置面板组件
	let PanelComponent = $derived.by(() => {
		if (!selectedNode) return null;
		return configPanelRegistry.getPanel(selectedNode.type ?? '');
	});

	// 面板是否展开：有选中节点 + 有对应的配置组件
	let isExpanded = $derived(!!selectedNode && !!PanelComponent);

	// 节点类型配置
	let nodeConfig = $derived(selectedNode ? nodeTypeConfigs[selectedNode.type ?? ''] : null);

	// 节点标题（本地状态）
	let titleValue = $state('');
	let descValue = $state('');

	// 同步选中节点数据到本地状态
	$effect(() => {
		if (selectedNode) {
			const data = selectedNode.data as Record<string, unknown>;
			titleValue = (data?.title as string) ?? nodeConfig?.label ?? '节点';
			descValue = (data?.desc as string) ?? '';
		}
	});

	function handleClose() {
		configPanelRegistry.closePanel();
	}

	function handleTitleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		titleValue = input.value;
	}

	function handleTitleBlur() {
		if (!selectedNode) return;
		const newTitle = titleValue.trim();
		if (newTitle) {
			workflowState.updateNode(selectedNode.id, { title: newTitle });
		}
	}

	function handleDescChange(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		descValue = textarea.value;
	}

	function handleDescBlur() {
		if (!selectedNode) return;
		workflowState.updateNode(selectedNode.id, { desc: descValue.trim() || undefined });
	}

	function handleRun() {
		console.log('Run node:', selectedNode?.id);
	}

	function handleViewDocs() {
		console.log('View docs for:', selectedNode?.type);
	}

	function handleDuplicate() {
		console.log('Duplicate node:', selectedNode?.id);
	}

	function handleDelete() {
		if (!selectedNode) return;
		workflowState.removeNode(selectedNode.id);
		configPanelRegistry.closePanel();
	}

	// 处理拖拽调整宽度
	function handleResize(e: MouseEvent) {
		e.preventDefault();
		const startX = e.clientX;
		const startWidth = panelWidth;

		function onMouseMove(moveEvent: MouseEvent) {
			const delta = startX - moveEvent.clientX;
			const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
			panelWidth = newWidth;
		}

		function onMouseUp() {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';
	}
</script>

<!-- 容器：始终存在，用于定位 MiniMap -->
<div class="absolute top-0 right-0 bottom-0 pointer-events-none" style:width={isExpanded ? `${panelWidth + 16}px` : '0px'}>
	<!-- MiniMap 始终可见，在左下角外部 -->
	<div class="absolute bottom-4 pointer-events-auto" style:left="-{133 + 16}px">
		<MiniMapPanel />
	</div>

	<!-- 配置面板：悬空 Card 样式 -->
	{#if isExpanded && PanelComponent && selectedNode && nodeConfig}
		<Card.Root class="absolute top-16 right-4 bottom-4 gap-0 flex flex-col pointer-events-auto shadow-lg" style="width: {panelWidth}px">
			<!-- 左侧拖拽手柄 -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div 
				class="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors z-20"
				onmousedown={handleResize}
			></div>

			<!-- 关闭按钮在右上角外部 -->
			<Button 
				variant="secondary" 
				size="icon" 
				class="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-10" 
				onclick={handleClose}
			>
				<Icon icon="mdi:close" width="14" height="14" />
			</Button>

			<!-- Header -->
			<Card.Header class="pb-2">
				<div class="flex items-center gap-3">
					<!-- 节点图标 -->
					<div class="flex items-center justify-center w-8 h-8 rounded-lg {nodeConfig.color} text-white shrink-0">
						<Icon icon={nodeConfig.icon} width="18" height="18" />
					</div>

					<!-- 节点名称 -->
					<div class="flex-1 min-w-0">
						<input
							type="text"
							value={titleValue}
							oninput={handleTitleChange}
							onblur={handleTitleBlur}
							class="w-full h-5 text-sm font-semibold bg-transparent border-0 p-0 outline-none text-foreground placeholder:text-muted-foreground focus:shadow-[inset_0_-1px_0_0_hsl(var(--primary))]"
							placeholder="节点名称"
						/>
					</div>

					<!-- 分隔线 -->
					<Separator orientation="vertical" class="h-8" />

					<!-- 操作按钮 -->
					<div class="flex items-center gap-1">
						<!-- 运行 -->
						<Button variant="ghost" size="icon" class="h-7 w-7" onclick={handleRun} title="运行节点">
							<Icon icon="mdi:play" width="16" height="16" />
						</Button>

						<!-- 查看文档 -->
						<Button variant="ghost" size="icon" class="h-7 w-7" onclick={handleViewDocs} title="查看文档">
							<Icon icon="mdi:help-circle-outline" width="16" height="16" />
						</Button>

						<!-- 更多操作 -->
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="ghost" size="icon" class="h-7 w-7">
										<Icon icon="mdi:dots-vertical" width="16" height="16" />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="min-w-[140px]">
								<DropdownMenu.Item onclick={handleDuplicate}>
									<Icon icon="mdi:content-copy" width="14" height="14" class="mr-2" />
									复制节点
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item onclick={handleDelete} class="text-destructive focus:text-destructive">
									<Icon icon="mdi:delete-outline" width="14" height="14" class="mr-2" />
									删除节点
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>

				<!-- 描述（单独一行，textarea 自动换行） -->
				<textarea
					value={descValue}
					oninput={handleDescChange}
					onblur={handleDescBlur}
					class="w-full text-xs bg-transparent border-0 p-0 outline-none text-muted-foreground placeholder:text-muted-foreground focus:text-foreground focus:shadow-[inset_0_-1px_0_0_hsl(var(--primary))] mt-2 resize-none field-sizing-content"
					placeholder="添加描述..."
					rows="1"
				></textarea>
			</Card.Header>

			<Separator />

			<Card.Content class="flex-1 overflow-auto pt-4">
				<PanelComponent nodeId={selectedNode.id} data={selectedNode.data} />
			</Card.Content>
		</Card.Root>
	{/if}
</div>
