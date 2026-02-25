<script lang="ts">
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select';
	import Icon from '@iconify/svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface AgentInfo {
		id: string;
		name: string;
		description?: string | null;
		avatar?: string | null;
		color?: string | null;
		inputSchema?: Record<string, unknown> | null;
		outputSchema?: Record<string, unknown> | null;
	}

	interface Props {
		value: string | undefined;
		onValueChange: (agent: AgentInfo | undefined) => void;
		placeholder?: string;
		required?: boolean;
		label?: string;
	}

	let { 
		value, 
		onValueChange, 
		placeholder = '选择智能体',
		required = false,
		label = '智能体'
	}: Props = $props();

	let agents = $state<AgentInfo[]>([]);
	let loading = $state(true);

	// 当前选中的 Agent
	let selectedAgent = $derived(agents.find(a => a.id === value));

	async function loadAgents() {
		loading = true;
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.postApiAiAgentQuery({ 
				filter: { status: '0' }, 
				limit: 100, 
				offset: 0 
			});
			if (res.data?.data) {
				agents = res.data.data as AgentInfo[];
			}
		} catch (err) {
			console.error('Failed to load agents:', err);
		} finally {
			loading = false;
		}
	}

	function handleValueChange(val: string | undefined) {
		if (!val) {
			onValueChange(undefined);
			return;
		}
		const agent = agents.find(a => a.id === val);
		onValueChange(agent);
	}

	onMount(() => {
		loadAgents();
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
	<Select.Root 
		type="single"
		value={value}
		onValueChange={handleValueChange}
		disabled={loading}
	>
		<Select.Trigger class="h-9 w-full">
			{#if loading}
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
					<span>加载中...</span>
				</div>
			{:else if selectedAgent}
				<div class="flex items-center gap-2">
					<div 
						class="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
						style="background-color: {selectedAgent.color ?? 'hsl(var(--muted-foreground))'}"
					>
						<Icon icon="mdi:robot-outline" class="w-3 h-3" />
					</div>
					<span>{selectedAgent.name}</span>
				</div>
			{:else}
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:robot-outline" class="w-4 h-4" />
					<span>{placeholder}</span>
				</div>
			{/if}
		</Select.Trigger>
		<Select.Content class="w-[var(--bits-floating-anchor-width)] max-h-64">
			{#if agents.length === 0}
				<div class="px-2 py-4 text-center text-sm text-muted-foreground">
					暂无可用智能体
				</div>
			{:else}
				{#each agents as agent (agent.id)}
					<Select.Item value={agent.id} label={agent.name}>
						<div class="flex items-center gap-2">
							<div 
								class="w-5 h-5 rounded flex items-center justify-center text-white text-xs shrink-0"
								style="background-color: {agent.color ?? 'hsl(var(--muted-foreground))'}"
							>
								<Icon icon="mdi:robot-outline" class="w-3 h-3" />
							</div>
							<div class="flex flex-col min-w-0">
								<span class="truncate">{agent.name}</span>
								{#if agent.description}
									<span class="text-xs text-muted-foreground truncate">{agent.description}</span>
								{/if}
							</div>
						</div>
					</Select.Item>
				{/each}
			{/if}
		</Select.Content>
	</Select.Root>
</div>
