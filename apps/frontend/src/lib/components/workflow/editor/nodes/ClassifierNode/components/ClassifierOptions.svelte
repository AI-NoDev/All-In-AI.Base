<script lang="ts">
	import type { ClassifierOption } from '../types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Icon from '@iconify/svelte';

	interface Props {
		options: ClassifierOption[];
		onOptionsChange: (options: ClassifierOption[]) => void;
	}

	let { options, onOptionsChange }: Props = $props();

	// 展开状态
	let expandedIds = $state<Set<string>>(new Set());

	function toggleExpand(id: string) {
		const newSet = new Set(expandedIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		expandedIds = newSet;
	}

	function addOption() {
		const newOption: ClassifierOption = {
			id: crypto.randomUUID(),
			label: `分类 ${options.length + 1}`,
			description: ''
		};
		onOptionsChange([...options, newOption]);
	}

	function removeOption(id: string) {
		onOptionsChange(options.filter(o => o.id !== id));
		// 同时移除展开状态
		const newSet = new Set(expandedIds);
		newSet.delete(id);
		expandedIds = newSet;
	}

	function duplicateOption(option: ClassifierOption) {
		const newOption: ClassifierOption = {
			id: crypto.randomUUID(),
			label: `${option.label} (副本)`,
			description: option.description
		};
		const index = options.findIndex(o => o.id === option.id);
		const newOptions = [...options];
		newOptions.splice(index + 1, 0, newOption);
		onOptionsChange(newOptions);
	}

	function updateOption(id: string, field: keyof ClassifierOption, value: string) {
		onOptionsChange(options.map(o => 
			o.id === id ? { ...o, [field]: value } : o
		));
	}

	function getDescriptionLength(option: ClassifierOption): number {
		return option.description?.length ?? 0;
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1">
			<span class="text-xs font-medium">分类</span>
			<span class="text-destructive text-xs">*</span>
		</div>
		<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={addOption}>
			<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
			添加
		</Button>
	</div>

	<div class="space-y-2">
		{#each options as option, index (option.id)}
			{@const isExpanded = expandedIds.has(option.id)}
			<div class="border border-border rounded-lg bg-muted/30 overflow-hidden">
				<!-- Header -->
				<div class="flex items-center gap-2 p-3">
					<Input 
						value={option.label}
						oninput={(e) => updateOption(option.id, 'label', (e.target as HTMLInputElement).value)}
						placeholder="分类名称"
						class="flex-1 h-8 text-sm font-medium bg-transparent border-0 p-0 focus-visible:ring-0"
					/>
					
					<div class="flex items-center gap-1 text-muted-foreground">
						<span class="text-xs">{getDescriptionLength(option)}</span>
						
						<!-- 插入变量按钮 -->
						<Button variant="ghost" size="icon" class="h-6 w-6">
							<Icon icon="mdi:code-braces" class="w-3.5 h-3.5" />
						</Button>
						
						<!-- 删除按钮 -->
						<Button 
							variant="ghost" 
							size="icon" 
							class="h-6 w-6 hover:text-destructive"
							onclick={() => removeOption(option.id)}
						>
							<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
						</Button>
						
						<!-- 复制按钮 -->
						<Button 
							variant="ghost" 
							size="icon" 
							class="h-6 w-6"
							onclick={() => duplicateOption(option)}
						>
							<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
						</Button>
						
						<!-- 展开/收起按钮 -->
						<Button 
							variant="ghost" 
							size="icon" 
							class="h-6 w-6"
							onclick={() => toggleExpand(option.id)}
						>
							<Icon icon={isExpanded ? "mdi:arrow-collapse" : "mdi:arrow-expand"} class="w-3.5 h-3.5" />
						</Button>
					</div>
				</div>

				<!-- Description -->
				<div class="px-3 pb-3">
					{#if isExpanded}
						<Textarea 
							value={option.description ?? ''}
							oninput={(e) => updateOption(option.id, 'description', (e.target as HTMLTextAreaElement).value)}
							placeholder="在这里输入你的主题内容"
							rows={4}
							class="text-sm resize-none bg-background"
						/>
					{:else}
						<div 
							class="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
							onclick={() => toggleExpand(option.id)}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && toggleExpand(option.id)}
						>
							{option.description || '在这里输入你的主题内容'}
						</div>
					{/if}
				</div>
			</div>
		{/each}

		{#if options.length === 0}
			<div class="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
				<Icon icon="mdi:folder-outline" class="w-8 h-8 mx-auto mb-2 opacity-50" />
				<p>暂无分类</p>
				<Button variant="outline" size="sm" class="mt-2" onclick={addOption}>
					<Icon icon="mdi:plus" class="w-4 h-4 mr-1" />
					添加分类
				</Button>
			</div>
		{/if}
	</div>
</div>
