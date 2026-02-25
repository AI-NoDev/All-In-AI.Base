<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
	import { JsonSchemaEditor, createSchema, fromJsonSchema, type JsonSchema } from '@qiyu-allinai/json-schema-editor';
	import { authStore } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	interface DataModel {
		id: string;
		name: string;
		description: string | null;
		jsonSchema: Record<string, unknown>;
		status: string;
	}

	interface Props {
		open: boolean;
		schema: JsonSchema;
		onOpenChange: (open: boolean) => void;
		onSave: (schema: JsonSchema, dataModelId?: string) => void;
	}

	let { open = $bindable(), schema, onOpenChange, onSave }: Props = $props();

	let activeTab = $state<'dataModel' | 'custom'>('dataModel');
	let localSchema = $state<JsonSchema>(createSchema());
	let selectedDataModelId = $state<string | undefined>(undefined);
	let dataModels = $state<DataModel[]>([]);
	let loading = $state(true);
	let searching = $state(false);
	let searchKeyword = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// 选中的数据模型
	let selectedDataModel = $derived(
		dataModels.find(dm => dm.id === selectedDataModelId)
	);

	async function loadDataModels(keyword?: string) {
		// 只有在有关键词时才显示 searching 状态，否则显示 loading
		if (keyword) {
			searching = true;
		} else {
			loading = true;
		}
		try {
			const api = authStore.createApi(true);
			const filter: { status: string; name?: string } = { status: '0' };
			if (keyword && keyword.trim()) {
				filter.name = keyword.trim();
			}
			const res = await api.ai.postApiAiDataModelQuery({
				filter,
				limit: 100,
				offset: 0
			});
			if (res.data?.data) {
				dataModels = res.data.data as DataModel[];
			}
		} catch (err) {
			console.error('Failed to load data models:', err);
		} finally {
			loading = false;
			searching = false;
		}
	}

	// 防抖搜索
	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchKeyword = target.value;
		
		// 清除之前的定时器
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		
		// 设置新的防抖定时器 (300ms)
		debounceTimer = setTimeout(() => {
			loadDataModels(searchKeyword.trim() || undefined);
		}, 300);
	}

	function handleSelectDataModel(dm: DataModel) {
		selectedDataModelId = dm.id;
		// 将数据库中的标准 JSON Schema 转换为编辑器格式
		if (dm.jsonSchema && typeof dm.jsonSchema === 'object') {
			try {
				localSchema = fromJsonSchema(dm.jsonSchema);
			} catch (err) {
				console.error('Failed to convert JSON Schema:', err);
				localSchema = createSchema();
			}
		}
	}

	function handleSave() {
		if (activeTab === 'dataModel' && selectedDataModelId) {
			onSave(localSchema, selectedDataModelId);
		} else {
			onSave(localSchema, undefined);
		}
		onOpenChange(false);
	}

	function handleCancel() {
		onOpenChange(false);
	}

	// 当 sheet 打开时，初始化状态
	$effect(() => {
		if (open) {
			localSchema = schema.properties.length > 0 ? { ...schema } : createSchema();
			searchKeyword = '';
			loadDataModels();
		}
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<Sheet.Root bind:open onOpenChange={onOpenChange}>
	<Sheet.Content class="sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>配置 JSON Schema</Sheet.Title>
			<Sheet.Description>
				选择已有的数据模型或自定义 JSON 结构
			</Sheet.Description>
		</Sheet.Header>

		<div class="py-4">
			<Tabs.Root bind:value={activeTab} class="w-full">
				<Tabs.List class="w-full grid grid-cols-2 mb-4">
					<Tabs.Trigger value="dataModel">
						<Icon icon="mdi:database-outline" class="w-4 h-4 mr-1.5" />
						数据模型
					</Tabs.Trigger>
					<Tabs.Trigger value="custom">
						<Icon icon="mdi:code-json" class="w-4 h-4 mr-1.5" />
						自定义
					</Tabs.Trigger>
				</Tabs.List>

				<!-- 数据模型选择 Tab -->
				<Tabs.Content value="dataModel" class="mt-0">
					<div class="space-y-3">
						<!-- 搜索框 -->
						<div class="relative">
							<Icon icon="mdi:magnify" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								value={searchKeyword}
								oninput={handleSearchInput}
								placeholder="搜索数据模型..."
								class="pl-8 pr-8 h-9"
							/>
							{#if searching}
								<Icon icon="mdi:loading" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
							{:else if searchKeyword}
								<button
									type="button"
									class="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
									onclick={() => { searchKeyword = ''; loadDataModels(); }}
								>
									<Icon icon="mdi:close" class="w-3.5 h-3.5 text-muted-foreground" />
								</button>
							{/if}
						</div>

						<!-- 数据模型列表 -->
						<div class="border border-border rounded-lg max-h-64 overflow-y-auto">
							{#if loading}
								<div class="flex items-center justify-center py-8">
									<Icon icon="mdi:loading" class="w-6 h-6 animate-spin text-muted-foreground" />
								</div>
							{:else if dataModels.length === 0}
								<div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
									<Icon icon="mdi:database-off-outline" class="w-10 h-10 opacity-50 mb-2" />
									<p class="text-sm">{searchKeyword ? '未找到匹配的数据模型' : '暂无数据模型'}</p>
								</div>
							{:else}
								{#each dataModels as dm (dm.id)}
									<button
										class="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 {selectedDataModelId === dm.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}"
										onclick={() => handleSelectDataModel(dm)}
									>
										<div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
											<Icon icon="mdi:database" class="w-4 h-4 text-primary" />
										</div>
										<div class="flex-1 min-w-0">
											<div class="flex items-center gap-2">
												<span class="text-sm font-medium truncate">{dm.name}</span>
												{#if selectedDataModelId === dm.id}
													<Icon icon="mdi:check-circle" class="w-4 h-4 text-primary shrink-0" />
												{/if}
											</div>
											{#if dm.description}
												<p class="text-xs text-muted-foreground mt-0.5 line-clamp-2">{dm.description}</p>
											{/if}
										</div>
									</button>
								{/each}
							{/if}
						</div>

						<!-- 选中的数据模型预览 -->
						{#if selectedDataModel}
							<div class="p-3 bg-muted/30 rounded-lg">
								<div class="flex items-center gap-2 mb-2">
									<Icon icon="mdi:eye-outline" class="w-4 h-4 text-muted-foreground" />
									<span class="text-xs font-medium">Schema 预览</span>
								</div>
								<pre class="text-xs text-muted-foreground overflow-auto max-h-32 font-mono">{JSON.stringify(selectedDataModel.jsonSchema, null, 2)}</pre>
							</div>
						{/if}
					</div>
				</Tabs.Content>

				<!-- 自定义 Schema Tab -->
				<Tabs.Content value="custom" class="mt-0">
					<div class="border border-border rounded-lg p-3 max-h-80 overflow-y-auto">
						<JsonSchemaEditor
							bind:schema={localSchema}
							locale="zh"
						/>
					</div>
					<p class="text-xs text-muted-foreground mt-2">
						添加字段来定义 JSON 结构，支持文本、数字、布尔、列表和对象类型
					</p>
				</Tabs.Content>
			</Tabs.Root>
		</div>

		<Sheet.Footer>
			<Button variant="outline" onclick={handleCancel}>取消</Button>
			<Button onclick={handleSave}>
				确定
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
