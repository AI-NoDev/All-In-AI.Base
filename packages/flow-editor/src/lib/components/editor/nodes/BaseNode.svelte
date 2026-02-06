<script lang="ts" generics="T extends BaseNodeData">
	import type { Snippet } from 'svelte';
	import type { BaseNodeData } from '$lib/types/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import { configPanelRegistry } from '$lib/components/editor/contexts/index.js';

	interface MenuItem {
		label: string;
		icon?: string;
		action: () => void;
		variant?: 'default' | 'destructive';
	}

	interface Props {
		nodeId: string;
		nodeData: T;
		content?: Snippet<[T]>;
		/** 快捷操作按钮 (显示在三点菜单左边) */
		quickActions?: Snippet;
		/** 下拉菜单项 */
		menuItems?: MenuItem[];
	}

	let { nodeId, nodeData, content, quickActions, menuItems = [] }: Props = $props();

	// 是否有描述
	let hasDesc = $derived(!!nodeData.desc);

	// 根据 configPanelRegistry 判断是否高亮（而不是 SvelteFlow 的 selected）
	let isHighlighted = $derived(configPanelRegistry.selectedNodeId === nodeId);
</script>

<div
	class="group relative min-w-[240px] rounded-lg border border-border bg-card text-xs shadow-sm transition-all
		{isHighlighted ? 'outline outline-1 outline-primary outline-offset-1 shadow-primary/15 shadow-lg' : ''}"
>
	<!-- Toolbar: 快捷按钮 + 三点菜单 -->
	<div class="absolute -top-9 right-0 flex items-center gap-1 opacity-0 transition-opacity
		{isHighlighted ? 'opacity-100' : 'group-hover:opacity-100'}">
		
		<!-- 快捷操作按钮 -->
		{#if quickActions}
			{@render quickActions()}
		{/if}

		<!-- 三点菜单 -->
		{#if menuItems.length > 0}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon" class="h-7 w-7 bg-background">
							<Icon icon="mdi:dots-horizontal" width="16" height="16" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="min-w-[140px]">
					{#each menuItems as item}
						<DropdownMenu.Item 
							onclick={item.action}
							class={item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
						>
							{#if item.icon}
								<Icon icon={item.icon} width="14" height="14" class="mr-2" />
							{/if}
							{item.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>

	<!-- 节点内容 -->
	{#if content}
		<div class="p-3 text-muted-foreground">
			{@render content(nodeData)}
		</div>
	{/if}

	<!-- 描述 Footer -->
	{#if hasDesc}
		<div class="border-t border-border px-3 py-2 text-xs text-muted-foreground">
			{nodeData.desc}
		</div>
	{/if}
</div>
