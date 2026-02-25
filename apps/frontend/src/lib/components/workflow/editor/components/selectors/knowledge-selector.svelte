<script lang="ts">
	import { onMount } from 'svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface KnowledgeBase {
		id: string;
		name: string;
		description?: string | null;
		icon?: string | null;
	}

	interface Props {
		/** 已选择的知识库 ID 列表 */
		selectedIds: string[];
		/** 选择变化回调 */
		onSelect: (kb: KnowledgeBase) => void;
		placeholder?: string;
		label?: string;
		required?: boolean;
	}

	let { 
		selectedIds = [],
		onSelect,
		placeholder = '添加知识库',
		label = '知识库',
		required = false
	}: Props = $props();

	let knowledgeBases = $state<KnowledgeBase[]>([]);
	let loading = $state(true);
	let open = $state(false);

	// 可用的知识库（排除已选择的）
	let availableKnowledgeBases = $derived(
		knowledgeBases.filter(kb => !selectedIds.includes(kb.id))
	);

	async function loadKnowledgeBases() {
		loading = true;
		try {
			const api = authStore.createApi(true);
			// 获取根目录下的文件夹作为知识库
			const res = await api.knowledge.postApiKnowledgeNodesQuery({
				filter: { parentId: null, type: 'folder' },
				limit: 100,
				offset: 0
			});
			if (res.data?.data) {
				knowledgeBases = res.data.data.map((node: { id: string; name: string; description?: string | null; icon?: string | null }) => ({
					id: node.id,
					name: node.name,
					description: node.description,
					icon: node.icon
				}));
			}
		} catch (err) {
			console.error('Failed to load knowledge bases:', err);
		} finally {
			loading = false;
		}
	}

	function handleSelect(kb: KnowledgeBase) {
		onSelect(kb);
		open = false;
	}

	onMount(() => {
		loadKnowledgeBases();
	});
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="h-7 w-7" disabled={loading}>
				{#if loading}
					<Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
				{:else}
					<Icon icon="mdi:plus" class="w-4 h-4" />
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-2" align="end">
		{#if availableKnowledgeBases.length > 0}
			<div class="space-y-1 max-h-64 overflow-auto">
				{#each availableKnowledgeBases as kb (kb.id)}
					<button
						class="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors text-left"
						onclick={() => handleSelect(kb)}
					>
						<Icon icon={kb.icon ?? 'mdi:database'} class="w-4 h-4 text-muted-foreground shrink-0" />
						<div class="flex flex-col min-w-0">
							<span class="truncate">{kb.name}</span>
							{#if kb.description}
								<span class="text-muted-foreground truncate">{kb.description}</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{:else if knowledgeBases.length === 0}
			<div class="text-xs text-muted-foreground text-center py-4">
				暂无可用知识库
			</div>
		{:else}
			<div class="text-xs text-muted-foreground text-center py-2">
				所有知识库已添加
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
