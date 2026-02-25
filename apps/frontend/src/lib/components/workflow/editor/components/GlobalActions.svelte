<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Kbd from '$lib/components/ui/kbd';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { workflowState, utilityPanelState } from '$lib/components/workflow/editor/contexts/index';
	import { useStore } from '@xyflow/svelte';

	interface Props {
		issueCount?: number;
		onTestRun?: () => void;
		onViewHistory?: () => void;
		onViewIssues?: () => void;
		onPublish?: () => void;
		onPublishDraft?: () => void;
		onVersionHistory?: () => void;
	}

	let {
		issueCount = 0,
		onTestRun,
		onViewHistory,
		onViewIssues,
		onPublish,
		onPublishDraft,
		onVersionHistory,
	}: Props = $props();

	let fileInputRef = $state<HTMLInputElement | null>(null);
	const store = useStore();

	function handleExport() {
		const name = workflowState.metadata.name || 'workflow';
		const viewport = store.viewport;
		workflowState.exportToFile(`${name}.yml`, viewport);
	}

	function handleImportClick() {
		fileInputRef?.click();
	}

	async function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const success = await workflowState.importFromFile(file);
			if (!success) {
				alert('导入失败，请检查文件格式');
			}
			input.value = '';
		}
	}
</script>

<input
	bind:this={fileInputRef}
	type="file"
	accept=".yml,.yaml"
	class="hidden"
	onchange={handleFileChange}
/>

<Tooltip.Provider>
	<div class="absolute top-4 right-4 z-10 flex items-center gap-2">
		<!-- 按钮组1：测试运行、运行历史、问题列表 -->
		<div class="flex items-center bg-background border border-border rounded-lg shadow-sm">
			<Button 
				variant="ghost" 
				size="sm" 
				class="h-8 px-3 rounded-r-none gap-2"
				onclick={onTestRun}
			>
				<Icon icon="mdi:play" class="w-4 h-4" />
				<span class="text-sm">测试运行</span>
				<Kbd.Group class="ml-1">
					<Kbd.Root>⌘</Kbd.Root>
					<Kbd.Root>R</Kbd.Root>
				</Kbd.Group>
			</Button>
			<Separator orientation="vertical" class="h-5" />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button 
							{...props}
							variant="ghost" 
							size="icon" 
							class="h-8 w-8 rounded-none"
							onclick={onViewHistory}
						>
							<Icon icon="mdi:history" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>运行历史</Tooltip.Content>
			</Tooltip.Root>
			<Separator orientation="vertical" class="h-5" />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button 
							{...props}
							variant="ghost" 
							size="sm" 
							class="h-8 px-2 rounded-l-none gap-1"
							onclick={onViewIssues}
						>
							<Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
							{#if issueCount > 0}
								<span class="text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 min-w-[18px] text-center">
									{issueCount}
								</span>
							{/if}
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>问题列表</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<!-- 按钮组2：导入导出、环境变量、系统变量 -->
		<div class="flex items-center bg-background border border-border rounded-lg shadow-sm">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" class="h-8 w-8 rounded-r-none" onclick={handleImportClick}>
							<Icon icon="mdi:import" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>导入 DSL</Tooltip.Content>
			</Tooltip.Root>
			<Separator orientation="vertical" class="h-5" />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" class="h-8 w-8 rounded-none" onclick={handleExport}>
							<Icon icon="mdi:export" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>导出 DSL</Tooltip.Content>
			</Tooltip.Root>
			<Separator orientation="vertical" class="h-5" />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button 
							{...props} 
							variant={utilityPanelState.isOpen('environment') ? 'secondary' : 'ghost'} 
							size="icon" 
							class="h-8 w-8 rounded-none"
							onclick={() => utilityPanelState.toggle('environment')}
						>
							<Icon icon="mdi:variable" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>环境变量</Tooltip.Content>
			</Tooltip.Root>
			<Separator orientation="vertical" class="h-5" />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button 
							{...props} 
							variant={utilityPanelState.isOpen('system') ? 'secondary' : 'ghost'} 
							size="icon" 
							class="h-8 w-8 rounded-l-none"
							onclick={() => utilityPanelState.toggle('system')}
						>
							<Icon icon="mdi:cog-outline" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>系统变量</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<!-- 发布下拉菜单 -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="default" size="sm" class="h-8 px-3 gap-2">
						<Icon icon="mdi:rocket-launch" class="w-4 h-4" />
						<span class="text-sm">发布</span>
						<Icon icon="mdi:chevron-down" class="w-4 h-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-48">
				<DropdownMenu.Item onclick={onPublish}>
					<Icon icon="mdi:rocket-launch" class="w-4 h-4 mr-2" />
					发布到生产
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={onPublishDraft}>
					<Icon icon="mdi:file-document-edit-outline" class="w-4 h-4 mr-2" />
					保存为草稿
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleImportClick}>
					<Icon icon="mdi:import" class="w-4 h-4 mr-2" />
					导入 YAML
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={handleExport}>
					<Icon icon="mdi:export" class="w-4 h-4 mr-2" />
					导出 YAML
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={onVersionHistory}>
					<Icon icon="mdi:source-branch" class="w-4 h-4 mr-2" />
					版本历史
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Tooltip.Provider>
