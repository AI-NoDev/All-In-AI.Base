<script lang="ts">
	import type { InputField } from './types';
	import { UI_TYPE_CONFIG } from './types';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { useSortable } from '@dnd-kit-svelte/sortable';

	interface Props {
		field: InputField;
		onEdit: (field: InputField) => void;
		onDelete: (fieldId: string) => void;
	}

	let { field, onEdit, onDelete }: Props = $props();

	// 使用函数传递 id 以支持响应式
	const sortable = useSortable({ id: () => field.id });

	// 获取响应式状态
	let isDragging = $derived(sortable.isDragging.current);

	// 获取 transition 样式
	let transitionStyle = $derived(sortable.transition.current);
</script>

<div
	use:sortable.setNodeRef
	class="flex items-center gap-2 p-2 border border-border rounded-md bg-background hover:bg-muted/50 transition-colors {field.hidden ? 'opacity-50' : ''} {isDragging ? 'opacity-50 shadow-lg' : ''}"
	style:transition={transitionStyle}
>
	<!-- 拖拽手柄 -->
	<button
		use:sortable.setActivatorNodeRef
		class="cursor-grab active:cursor-grabbing p-0.5 -ml-1 text-muted-foreground hover:text-foreground"
		aria-label="拖拽排序"
	>
		<Icon icon="mdi:drag-vertical" class="w-4 h-4" />
	</button>

	<!-- 字段类型图标 -->
	<Icon icon={UI_TYPE_CONFIG[field.uiType].icon} class="w-4 h-4 text-muted-foreground shrink-0" />

	<!-- 字段信息 -->
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-1">
			<span class="text-sm font-medium truncate">{field.label}</span>
			{#if field.required}
				<span class="text-destructive text-xs font-bold">*</span>
			{/if}
			{#if field.hidden}
				<span title="隐藏字段">
					<Icon icon="mdi:eye-off" class="w-3 h-3 text-muted-foreground" />
				</span>
			{/if}
		</div>
		<span class="text-xs text-muted-foreground font-mono truncate block">{field.variable}</span>
	</div>

	<!-- 数据类型标签 -->
	<div class="flex items-center gap-1 shrink-0">
		<span class="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{field.type}</span>
	</div>

	<!-- 分隔线 -->
	<div class="w-px h-8 bg-border shrink-0"></div>

	<!-- 操作按钮 -->
	<div class="flex items-center gap-0.5 shrink-0">
		<Button
			variant="ghost"
			size="icon"
			class="h-7 w-7"
			onclick={() => onEdit(field)}
			title="编辑"
		>
			<Icon icon="mdi:pencil" class="w-3.5 h-3.5" />
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="h-7 w-7 text-destructive hover:text-destructive"
			onclick={() => onDelete(field.id)}
			title="删除"
		>
			<Icon icon="mdi:delete" class="w-3.5 h-3.5" />
		</Button>
	</div>
</div>
