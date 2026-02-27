<script lang="ts">
	import { onMount } from 'svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface McpServer {
		id: string;
		name: string;
		description?: string | null;
		status: string;
	}

	interface Props {
		value: string[];
		onValueChange: (ids: string[]) => void;
		placeholder?: string;
		required?: boolean;
		label?: string;
	}

	let { 
		value = [], 
		onValueChange, 
		placeholder = '选择 MCP 服务器',
		required = false,
		label = 'MCP 服务器'
	}: Props = $props();

	let mcpServers = $state<McpServer[]>([]);
	let loading = $state(true);
	let open = $state(false);

	// 选中的服务器列表
	let selectedServers = $derived(
		mcpServers.filter(s => value.includes(s.id))
	);

	async function loadMcpServers() {
		loading = true;
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.postApiAiMcpServerQuery({ 
				filter: { status: '0' }, 
				limit: 100, 
				offset: 0 
			});
			if (res.data?.data) {
				mcpServers = res.data.data as McpServer[];
			}
		} catch (err) {
			console.error('Failed to load MCP servers:', err);
		} finally {
			loading = false;
		}
	}

	function toggleServer(serverId: string) {
		if (value.includes(serverId)) {
			onValueChange(value.filter(id => id !== serverId));
		} else {
			onValueChange([...value, serverId]);
		}
	}

	function selectAll() {
		onValueChange(mcpServers.map(s => s.id));
	}

	function clearAll() {
		onValueChange([]);
	}

	function removeServer(serverId: string) {
		onValueChange(value.filter(id => id !== serverId));
	}

	onMount(() => {
		loadMcpServers();
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
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="h-auto min-h-9 w-full justify-start font-normal"
					disabled={loading}
				>
					{#if loading}
						<div class="flex items-center gap-2 text-muted-foreground">
							<Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
							<span>加载中...</span>
						</div>
					{:else if selectedServers.length === 0}
						<div class="flex items-center gap-2 text-muted-foreground">
							<Icon icon="mdi:server-network" class="w-4 h-4" />
							<span>{placeholder}</span>
						</div>
					{:else}
						<div class="flex flex-wrap gap-1">
							{#each selectedServers.slice(0, 3) as server (server.id)}
								<Badge variant="secondary" class="text-xs">
									{server.name}
									<button
										class="ml-1 hover:text-destructive"
										onclick={(e) => { e.stopPropagation(); removeServer(server.id); }}
									>
										<Icon icon="mdi:close" class="w-3 h-3" />
									</button>
								</Badge>
							{/each}
							{#if selectedServers.length > 3}
								<Badge variant="outline" class="text-xs">
									+{selectedServers.length - 3}
								</Badge>
							{/if}
						</div>
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-80 p-0" align="start">
			<div class="p-2 border-b flex items-center justify-between">
				<span class="text-xs text-muted-foreground">
					已选择 {value.length} / {mcpServers.length}
				</span>
				<div class="flex items-center gap-1">
					<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={selectAll}>
						全选
					</Button>
					<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={clearAll}>
						清空
					</Button>
				</div>
			</div>
			<ScrollArea class="max-h-64">
				{#if mcpServers.length === 0}
					<div class="px-2 py-4 text-center text-sm text-muted-foreground">
						暂无可用 MCP 服务器
					</div>
				{:else}
					<div class="p-1">
						{#each mcpServers as server (server.id)}
							<button
								class="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 text-left"
								onclick={() => toggleServer(server.id)}
							>
								<Checkbox checked={value.includes(server.id)} />
								<div class="flex items-center gap-2 flex-1 min-w-0">
									<Icon icon="mdi:server" class="w-4 h-4 text-muted-foreground shrink-0" />
									<div class="flex flex-col min-w-0">
										<span class="text-sm truncate">{server.name}</span>
										{#if server.description}
											<span class="text-xs text-muted-foreground truncate">{server.description}</span>
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</ScrollArea>
		</Popover.Content>
	</Popover.Root>
</div>
