<script lang="ts">
	import { onMount } from 'svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface ModelConfig {
		id: string;          // 模型 UUID
		provider: string;    // 提供商 UUID
		model: string;       // 模型标识 (如 deepseek-chat)
		displayName?: string; // 显示名称
		supportImageInput?: boolean; // 是否支持图片输入
		supportVideoInput?: boolean; // 是否支持视频输入
	}

	interface AIModel {
		id: string;
		name: string;
		modelId: string;
		providerId: string;
		status: string;
		supportImageInput: boolean;
		supportVideoInput: boolean;
	}

	interface AIProvider {
		id: string;
		name: string;
		status: string;
	}

	interface Props {
		value: ModelConfig | undefined;
		onValueChange: (value: ModelConfig | undefined) => void;
		placeholder?: string;
		required?: boolean;
		label?: string;
	}

	let { 
		value, 
		onValueChange, 
		placeholder = '选择模型',
		required = false,
		label = '模型'
	}: Props = $props();

	let models = $state<AIModel[]>([]);
	let providers = $state<AIProvider[]>([]);
	let providerMap = $derived.by(() => {
		const map: Record<string, string> = {};
		for (const p of providers) {
			map[p.id] = p.name;
		}
		return map;
	});
	let loading = $state(true);
	let searching = $state(false);
	let searchQuery = $state('');
	let open = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// 按 provider 分组，使用 provider 名称
	let groupedModels = $derived.by(() => {
		const groups: Record<string, AIModel[]> = {};
		for (const model of models) {
			const providerName = providerMap[model.providerId] ?? model.providerId;
			if (!groups[providerName]) groups[providerName] = [];
			groups[providerName].push(model);
		}
		return groups;
	});

	// 当前选中的显示名称
	let selectedDisplay = $derived.by(() => {
		if (!value) return null;
		const found = models.find(m => m.id === value.id);
		return found?.name ?? value.displayName ?? value.model;
	});

	async function loadProviders() {
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.postApiAiProviderQuery({
				filter: { status: '0' },
				limit: 100,
				offset: 0
			});
			if (res.data?.data) {
				providers = res.data.data as AIProvider[];
			}
		} catch (err) {
			console.error('Failed to load providers:', err);
		}
	}

	async function loadModels(keyword?: string) {
		if (keyword) {
			searching = true;
		} else {
			loading = true;
		}
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.postApiAiModelQuery({ 
				filter: { 
					status: '0',
					...(keyword ? { name: keyword } : {})
				}, 
				limit: 100, 
				offset: 0 
			});
			if (res.data?.data) {
				models = res.data.data as AIModel[];
			}
		} catch (err) {
			console.error('Failed to load models:', err);
		} finally {
			loading = false;
			searching = false;
		}
	}

	async function loadData() {
		loading = true;
		await Promise.all([loadProviders(), loadModels()]);
		loading = false;
	}

	// 防抖搜索
	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
		
		// 清除之前的定时器
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		
		// 设置新的防抖定时器 (300ms)
		debounceTimer = setTimeout(() => {
			loadModels(searchQuery.trim() || undefined);
		}, 300);
	}

	function handleSelect(model: AIModel) {
		onValueChange({
			id: model.id,
			provider: model.providerId,
			model: model.modelId,
			displayName: model.name,
			supportImageInput: model.supportImageInput,
			supportVideoInput: model.supportVideoInput
		});
		open = false;
		searchQuery = '';
	}

	function handleClear() {
		onValueChange(undefined);
	}

	// 打开时重置搜索
	$effect(() => {
		if (open) {
			searchQuery = '';
			loadData();
		}
	});

	onMount(() => {
		loadData();
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<div class="space-y-2">
	{#if label}
		<div class="flex items-center gap-1">
			<span class="text-xs font-medium">{label}</span>
			{#if required}
				<span class="text-destructive text-xs">*</span>
			{/if}
		</div>
	{/if}
	<Popover.Root bind:open>
		<Popover.Trigger class="w-full">
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="h-9 w-full justify-between" disabled={loading}>
					{#if loading}
						<div class="flex items-center gap-2 text-muted-foreground">
							<Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
							<span>加载中...</span>
						</div>
					{:else if value}
						<div class="flex items-center gap-2">
							<Icon icon="mdi:robot" class="w-4 h-4 text-muted-foreground" />
							<span class="truncate">{selectedDisplay}</span>
						</div>
						<button
							type="button"
							class="ml-auto p-0.5 hover:bg-muted rounded"
							onclick={(e) => { e.stopPropagation(); handleClear(); }}
						>
							<Icon icon="mdi:close" class="w-3.5 h-3.5 text-muted-foreground" />
						</button>
					{:else}
						<div class="flex items-center gap-2 text-muted-foreground">
							<Icon icon="mdi:alert" class="w-4 h-4 text-amber-500" />
							<span>{placeholder}</span>
						</div>
						<Icon icon="mdi:chevron-down" class="w-4 h-4 text-muted-foreground" />
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-72 p-0" align="start">
			<!-- 搜索输入框 -->
			<div class="p-2 border-b border-border">
				<div class="relative">
					<Icon icon="mdi:magnify" class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="搜索模型..."
						value={searchQuery}
						oninput={handleSearchInput}
						class="h-8 pl-8 pr-8 text-sm"
					/>
					{#if searching}
						<Icon icon="mdi:loading" class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
					{:else if searchQuery}
						<button
							type="button"
							class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
							onclick={() => { searchQuery = ''; loadModels(); }}
						>
							<Icon icon="mdi:close" class="w-3.5 h-3.5 text-muted-foreground" />
						</button>
					{/if}
				</div>
			</div>
			
			<!-- 模型列表 -->
			<div class="max-h-64 overflow-auto p-1">
				{#if models.length === 0}
					<div class="px-2 py-4 text-center text-sm text-muted-foreground">
						{searchQuery ? '未找到匹配的模型' : '暂无可用模型'}
					</div>
				{:else}
					{#each Object.entries(groupedModels) as [provider, providerModels] (provider)}
						<div class="mb-1">
							<div class="text-xs text-muted-foreground px-2 py-1.5 font-medium">
								{provider}
							</div>
							{#each providerModels as model (model.id)}
								<button
									type="button"
									class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left {value?.id === model.id ? 'bg-muted' : ''}"
									onclick={() => handleSelect(model)}
								>
									<Icon icon="mdi:robot" class="w-4 h-4 text-muted-foreground shrink-0" />
									<span class="truncate">{model.name}</span>
									{#if value?.id === model.id}
										<Icon icon="mdi:check" class="w-4 h-4 text-primary ml-auto shrink-0" />
									{/if}
								</button>
							{/each}
						</div>
					{/each}
				{/if}
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
