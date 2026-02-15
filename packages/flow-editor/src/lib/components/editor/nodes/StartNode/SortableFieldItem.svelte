<script lang="ts">
	import type { InputField, InputFieldType } from './types.js';
	import { FIELD_TYPE_DATA_TYPES } from './types.js';
	import { Button } from '@qiyu-allinai/ui/components/button';
	import Icon from '@iconify/svelte';
	import { useSortable } from '@dnd-kit-svelte/sortable';

	interface Props {
		field: InputField;
		onEdit: (field: InputField) => void;
		onDelete: (fieldId: string) => void;
	}

	let { field, onEdit, onDelete }: Props = $props();

	// 字段类型图标映射
	const fieldTypeIcons: Record<InputFieldType, string> = {
		text: 'mdi:format-text',
		paragraph: 'mdi:text-long',
		select: 'mdi:form-dropdown',
		number: 'mdi:numeric',
		checkbox: 'mdi:checkbox-marked-outline',
		file: 'mdi:file-outline',
		files: 'mdi:file-multiple-outline',
		json: 'mdi:code-json',
	};

	const sortable = useSortable({ id: () => field.id });
	const { isDragging, setNodeRef, setActivatorNodeRef, listeners, attributes, transform, transition } = sortable;

	let isHovered = $state(false);

	// 计算拖拽时的样式
	let dragStyle = $derived.by(() => {
		const t = transform.current;
		const trans = transition.current;
		if (!t) return '';
		return `transform: translate3d(${t.x}px, ${t.y}px, 0); ${trans ? `transition: ${trans};` : ''}`;
	});
</script>

<div
	use:setNodeRef
	class="flex items-center gap-2 p-2 border border-border rounded-md transition-colors {field.hidden ? 'opacity-50' : ''} {isDragging.current ? 'opacity-50 shadow-lg z-10 bg-background' : ''}"
	style={dragStyle}
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
	{...attributes.current}
>
	<!-- 左侧：图标/拖拽手柄 -->
	<div 
		use:setActivatorNodeRef
		class="w-4 h-4 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
		{...listeners.current}
	>
		{#if isHovered}
			<Icon icon="mdi:drag" class="w-4 h-4 text-muted-foreground" />
		{:else}
			<Icon icon={fieldTypeIcons[field.type]} class="w-4 h-4 text-muted-foreground" />
		{/if}
	</div>

	<!-- 中间：显示名称 + 变量名 -->
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-1">
			<span class="text-sm font-medium truncate">{field.label}</span>
		</div>
		<span class="text-xs text-muted-foreground font-mono truncate block">{field.variable}</span>
	</div>

	<!-- 分隔线 -->
	<div class="w-px h-8 bg-border shrink-0"></div>

	<!-- 右侧：状态标记 或 操作按钮 -->
	<div class="flex items-center gap-1 shrink-0 min-w-[72px] justify-end">
		{#if isHovered}
			<!-- hover 时显示编辑和删除按钮 -->
			<Button 
				variant="ghost" 
				size="icon" 
				class="h-6 w-6" 
				onclick={() => onEdit(field)}
			>
				<Icon icon="mdi:pencil" class="w-3.5 h-3.5" />
			</Button>
			<Button 
				variant="ghost" 
				size="icon" 
				class="h-6 w-6 text-destructive hover:text-destructive" 
				onclick={() => onDelete(field.id)}
			>
				<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
			</Button>
		{:else}
			<!-- 非 hover 时显示状态标记 -->
			{#if field.required}
				<span class="text-xs text-destructive font-bold">*</span>
			{/if}
			{#if field.hidden}
				<Icon icon="mdi:eye-off" class="w-3.5 h-3.5 text-muted-foreground" />
			{/if}
			<span class="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded font-mono">
				{FIELD_TYPE_DATA_TYPES[field.type]}
			</span>
		{/if}
	</div>
</div>
