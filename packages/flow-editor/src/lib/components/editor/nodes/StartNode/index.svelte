<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Position } from '@xyflow/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
	import type { StartNodeData, InputFieldType } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: StartNodeData;
	}

	let { id, data }: Props = $props();

	// 检查 source handle 是否已连接
	let sourceConnected = $derived(workflowState.edges.some(e => e.source === id));

	// 输入字段列表
	let inputs = $derived(data.inputs ?? []);

	// 字段类型图标映射
	const fieldTypeIcons: Record<InputFieldType, string> = {
		text: 'mdi:format-text',
		paragraph: 'mdi:text-long',
		number: 'mdi:numeric',
		select: 'mdi:form-dropdown',
		file: 'mdi:file-outline',
		files: 'mdi:file-multiple-outline',
	};

	// 注册配置面板
	onMount(() => {
		configPanelRegistry.register('start', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => console.log('delete', id), variant: 'destructive' as const },
	];
</script>

<BaseNode nodeId={id} nodeData={data} {menuItems}>
	{#snippet content(nodeData)}
		<!-- Header -->
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-green-500 text-white h-8 w-8">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="material-symbols:play-arrow" width="18" height="18" />
				</div>
			</Avatar.Root>
			<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || '开始'}</span>
		</div>

		<!-- 输入字段列表 -->
		{#if inputs.length > 0}
			<div class="mt-3 border-t border-border -mx-3 px-3 pt-2 space-y-1">
				{#each inputs as field (field.id)}
					<div class="flex items-center gap-2 py-1.5 text-xs">
						<Icon icon={fieldTypeIcons[field.type]} class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
						<span class="text-foreground truncate">{field.label}</span>
						{#if field.required}
							<span class="text-destructive text-xs">*</span>
						{/if}
						<span class="ml-auto text-muted-foreground font-mono text-[10px] truncate max-w-[80px]">{field.variable}</span>
					</div>
				{/each}
			</div>
		{/if}
	{/snippet}

	{#snippet quickActions()}
		<Button variant="outline" size="icon" class="h-7 w-7 bg-background">
			<Icon icon="mdi:pencil" width="14" height="14" />
		</Button>
	{/snippet}
</BaseNode>

<!-- 输出引脚对齐 header 中心：padding(12) + avatar高度(32)/2 = 28px -->
<NodeHandler type="source" position={Position.Right} connected={sourceConnected} top={28} />
