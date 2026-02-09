<script lang="ts">
	import { onMount } from 'svelte';
	import { NodeResizer } from '@xyflow/svelte';
	import type { NoteNodeData, NoteColor } from './types.js';
	import { getNoteColorConfig } from './types.js';
	import RichTextEditor from './components/RichTextEditor.svelte';
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: NoteNodeData;
		selected?: boolean;
	}

	let { id, data, selected = false }: Props = $props();

	// 编辑状态（独立于选中状态）
	let isEditing = $state(false);

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as NoteNodeData) ?? data;
	});

	// 获取颜色配置
	let colorConfig = $derived(getNoteColorConfig(currentData.color));
	let currentColor = $derived(currentData.color ?? 'green');
	let showAuthor = $derived(!!currentData.author);

	// 最小尺寸常量
	const MIN_WIDTH = 280;
	const MIN_HEIGHT = 150;

	// 是否高亮
	let isHighlighted = $derived(configPanelRegistry.selectedNodeId === id);
	
	// 是否正在放置此节点
	let isPlacing = $derived(workflowState.placingNodeId === id);

	onMount(() => {
		configPanelRegistry.register('note', ConfigPanel);
	});

	function handleDelete() {
		workflowState.nodes = workflowState.nodes.filter(n => n.id !== id);
	}

	function handleCopy() {
		// TODO: 复制内容到剪贴板
	}

	function handleDuplicate() {
		// TODO: 复制节点
	}

	function handleColorChange(color: NoteColor) {
		workflowState.updateNode(id, { color });
	}

	function handleAuthorToggle(show: boolean) {
		workflowState.updateNode(id, { author: show ? 'Dify' : undefined });
	}

	function handleContentChange(markdown: string) {
		workflowState.updateNode(id, { content: markdown });
	}

	// 点击进入编辑模式
	function handleClick(e: MouseEvent) {
		if (!isEditing) {
			e.stopPropagation();
			isEditing = true;
		}
	}

	// 编辑器失去焦点时退出编辑模式
	function handleEditorBlur(e: FocusEvent) {
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		// 如果焦点转移到 toolbar 或节点内部元素，不退出编辑
		if (relatedTarget?.closest('.note-node-container') || relatedTarget?.closest('.note-toolbar')) {
			return;
		}
		isEditing = false;
	}
</script>

<!-- 可调整大小 - 编辑时隐藏 -->
<NodeResizer 
	minWidth={MIN_WIDTH} 
	minHeight={MIN_HEIGHT} 
	isVisible={selected && !isEditing}
	lineClass="!border-transparent"
	handleClass="!w-2 !h-2 !bg-transparent !border-transparent"
/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="note-node-container group relative rounded-lg border-2 transition-all h-full overflow-visible
		{colorConfig.bg} {colorConfig.border}
		{isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}
		{isPlacing ? 'opacity-70 pointer-events-none animate-pulse' : ''}
		{isEditing ? 'cursor-text' : 'cursor-grab'}"
	style:min-width="{MIN_WIDTH}px"
	style:min-height="{MIN_HEIGHT}px"
	onclick={handleClick}
	data-editing={isEditing}
>
	<!-- 富文本编辑器 -->
	<RichTextEditor 
		{colorConfig}
		{currentColor}
		{showAuthor}
		showToolbar={isEditing}
		initialContent={currentData.content ?? ''}
		onBlur={handleEditorBlur}
		onColorChange={handleColorChange}
		onAuthorToggle={handleAuthorToggle}
		onContentChange={handleContentChange}
		onCopy={handleCopy}
		onDuplicate={handleDuplicate}
		onDelete={handleDelete}
	/>

	<!-- 底部作者信息 -->
	{#if currentData.author}
		<div class="absolute bottom-0 left-0 right-0 px-3 py-2 border-t {colorConfig.border} text-xs text-muted-foreground bg-background/50">
			{currentData.author}
		</div>
	{/if}
</div>

<style>
	/* 编辑时禁用节点拖动 */
	:global(.svelte-flow__node:has([data-editing="true"])) {
		pointer-events: auto !important;
	}
	
	:global(.svelte-flow__node:has([data-editing="true"]) .svelte-flow__handle) {
		pointer-events: none !important;
	}
	
	/* 确保 NoteNode 的浮动元素不被裁剪 */
	:global(.svelte-flow__node:has(.note-node-container)) {
		overflow: visible !important;
	}
</style>
