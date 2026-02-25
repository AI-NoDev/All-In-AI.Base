<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { StartNodeData, InputField } from './types';
	import { BUILTIN_FIELDS, UI_TYPE_CONFIG, getAllInputFields } from './types';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { configPanelRegistry } from '$lib/components/workflow/editor/contexts/index';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: StartNodeData;
	}

	let { id, data }: Props = $props();

	// 所有输入字段（内置 + 用户定义）
	let allInputs = $derived(getAllInputFields(data));

	// 注册配置面板
	onMount(() => {
		configPanelRegistry.register('start', ConfigPanel);
	});
</script>

<!-- 开始节点：无输入引脚，有输出引脚（ID 为 'source'） -->
<BaseNode nodeId={id} nodeData={data} showInput={false} outputId="source" width={240}>
	{#snippet content(nodeData)}
		<!-- Header -->
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-green-500 text-white h-8 w-8 shrink-0">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="material-symbols:play-arrow" width="18" height="18" />
				</div>
			</Avatar.Root>
			<span class="text-sm font-semibold text-foreground tracking-tight truncate">{nodeData.title || '开始'}</span>
		</div>

		<!-- 输入字段列表 -->
		{#if allInputs.length > 0}
			<div class="mt-3 border-t border-border -mx-3 px-3 pt-2 space-y-1">
				{#each allInputs as field (field.id)}
					<div class="flex items-center gap-2 py-1.5 text-xs {field.hidden ? 'opacity-50' : ''}">
						<Icon icon={UI_TYPE_CONFIG[field.uiType].icon} class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
						<span class="text-foreground truncate">{field.label}</span>
						{#if field.builtin}
							<span title="系统内置">
								<Icon icon="mdi:lock" class="w-3 h-3 text-muted-foreground shrink-0" />
							</span>
						{/if}
						{#if field.required}
							<span class="text-destructive text-xs font-bold">*</span>
						{/if}
						{#if field.hidden}
							<span title="隐藏">
								<Icon icon="mdi:eye-off" class="w-3 h-3 text-muted-foreground shrink-0" />
							</span>
						{/if}
						<span class="ml-auto text-muted-foreground font-mono text-[10px] truncate max-w-[80px]">{field.variable}</span>
					</div>
				{/each}
			</div>
		{/if}
	{/snippet}
</BaseNode>
