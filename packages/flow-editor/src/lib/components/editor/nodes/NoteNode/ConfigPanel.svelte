<script lang="ts">
	import type { NoteNodeData, NoteColor } from './types.js';
	import { NOTE_COLORS, getNoteColorConfig } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Textarea } from '@qiyu-allinai/ui/components/textarea';
	import { Switch } from '@qiyu-allinai/ui/components/switch';
	import { Label } from '@qiyu-allinai/ui/components/label';
	import Icon from '@iconify/svelte';

	interface Props {
		nodeId: string;
		data: NoteNodeData;
	}

	let { nodeId }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as NoteNodeData | undefined;
	});

	let content = $derived(currentData?.content ?? '');
	let color = $derived(currentData?.color ?? 'green');
	let showAuthor = $derived(!!currentData?.author);

	function handleContentChange(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		workflowState.updateNode(nodeId, { content: target.value });
	}

	function handleColorChange(newColor: NoteColor) {
		workflowState.updateNode(nodeId, { color: newColor });
	}

	function handleAuthorToggle(checked: boolean) {
		workflowState.updateNode(nodeId, { author: checked ? 'Dify' : undefined });
	}
</script>

<div class="space-y-4">
	<!-- 颜色选择 -->
	<div class="space-y-2">
		<span class="text-xs font-medium">颜色</span>
		<div class="flex gap-2">
			{#each NOTE_COLORS as colorOption (colorOption.value)}
				<button
					type="button"
					class="w-6 h-6 rounded-full transition-transform hover:scale-110 {color === colorOption.value ? 'ring-2 ring-offset-2 ring-foreground/50' : ''}"
					style:background-color={colorOption.dot}
					onclick={() => handleColorChange(colorOption.value)}
					title={colorOption.label}
				></button>
			{/each}
		</div>
	</div>

	<!-- 内容 -->
	<div class="space-y-2">
		<span class="text-xs font-medium">内容</span>
		<Textarea 
			value={content}
			oninput={handleContentChange}
			placeholder="在这里输入注释内容..."
			rows={6}
			class="resize-none"
		/>
	</div>

	<!-- 显示作者 -->
	<div class="flex items-center justify-between">
		<Label for="show-author" class="text-xs font-medium">显示作者</Label>
		<Switch 
			id="show-author"
			checked={showAuthor}
			onCheckedChange={handleAuthorToggle}
		/>
	</div>

	<!-- 提示 -->
	<div class="pt-2 border-t border-border">
		<p class="text-xs text-muted-foreground">
			<Icon icon="mdi:information-outline" class="w-3.5 h-3.5 inline mr-1" />
			注释节点仅用于添加说明，不参与工作流执行
		</p>
	</div>
</div>
