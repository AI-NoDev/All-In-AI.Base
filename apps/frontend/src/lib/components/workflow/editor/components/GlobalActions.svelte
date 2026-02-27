<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Kbd from '$lib/components/ui/kbd';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { workflowState, utilityPanelState, runningState } from '$lib/components/workflow/editor/contexts/index';
	import { validateWorkflow } from '$lib/components/workflow/editor/validation/index';
	import { useStore } from '@xyflow/svelte';

	interface Props {
		onTestRun?: () => void;
		onStopRun?: () => void;
		onSetInputs?: () => void;
		onViewHistory?: () => void;
		onPublish?: () => void;
		onPublishDraft?: () => void;
		onVersionHistory?: () => void;
	}

	let {
		onTestRun,
		onStopRun,
		onSetInputs,
		onViewHistory,
		onPublish,
		onPublishDraft,
		onVersionHistory,
	}: Props = $props();

	// 运行状态
	let isRunning = $derived(runningState.isRunning);

	// 检查是否有环境变量值为空（使用 $derived.by 确保响应性）
	let hasEmptyEnvVars = $derived.by(() =>
		workflowState.environmentVariables.some(v => !v.value || v.value.trim() === '')
	);

	// 计算验证问题（响应式）
	let issues = $derived.by(() => validateWorkflow(
		workflowState.nodes,
		workflowState.edges,
		workflowState.environmentVariables,
		workflowState.inputVariables
	));

	let errorCount = $derived(issues.filter(i => i.severity === 'error').length);
	let warningCount = $derived(issues.filter(i => i.severity === 'warning').length);
	let issueCount = $derived(issues.length);

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

	function handleViewIssues() {
		utilityPanelState.toggle('issues');
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
		<!-- 按钮组1：设置参数、测试运行/终止、运行历史、问题列表 -->
		<div class="flex items-center bg-background border border-border rounded-lg shadow-sm">
			<!-- 设置参数按钮 -->
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button 
							{...props}
							variant="ghost" 
							size="icon" 
							class="h-8 w-8 rounded-r-none"
							onclick={onSetInputs}
							disabled={isRunning}
						>
							<Icon icon="mdi:form-textbox" class="w-4 h-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>设置输入参数</Tooltip.Content>
			</Tooltip.Root>
			<Separator orientation="vertical" class="h-5" />
			<!-- 测试运行/终止按钮 -->
			{#if isRunning}
				<Button 
					variant="ghost" 
					size="sm" 
					class="h-8 px-3 rounded-none gap-2 text-destructive hover:text-destructive"
					onclick={onStopRun}
				>
					<Icon icon="mdi:stop" class="w-4 h-4" />
					<span class="text-sm">终止</span>
				</Button>
			{:else}
				<Button 
					variant="ghost" 
					size="sm" 
					class="h-8 px-3 rounded-none gap-2"
					onclick={onTestRun}
				>
					<Icon icon="mdi:play" class="w-4 h-4" />
					<span class="text-sm">测试运行</span>
					<Kbd.Group class="ml-1">
						<Kbd.Root>⌘</Kbd.Root>
						<Kbd.Root>R</Kbd.Root>
					</Kbd.Group>
				</Button>
			{/if}
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
							variant={utilityPanelState.isOpen('issues') ? 'secondary' : 'ghost'} 
							size="icon" 
							class="h-8 w-8 rounded-l-none relative"
							onclick={handleViewIssues}
						>
							<Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
							{#if errorCount > 0}
								<span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium">
									{errorCount}
								</span>
							{:else if warningCount > 0}
								<span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-medium">
									{warningCount}
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
							class="h-8 w-8 rounded-none relative"
							onclick={() => utilityPanelState.toggle('environment')}
						>
							<Icon icon="mdi:variable" class="w-4 h-4" />
							{#if hasEmptyEnvVars}
								<span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white">
									<Icon icon="mdi:exclamation" class="w-3 h-3" />
								</span>
							{/if}
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
