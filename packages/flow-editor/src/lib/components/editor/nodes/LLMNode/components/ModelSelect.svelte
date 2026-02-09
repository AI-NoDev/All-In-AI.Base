<script lang="ts">
	import { MOCK_MODELS } from '../types.js';
	import * as Select from '$lib/components/ui/select';
	import Icon from '@iconify/svelte';

	interface ModelConfig {
		provider: string;
		model: string;
		displayName?: string;
	}

	interface Props {
		modelConfig: ModelConfig | undefined;
		onModelChange: (value: string) => void;
	}

	let { modelConfig, onModelChange }: Props = $props();

	let selectedModelDisplay = $derived.by(() => {
		if (!modelConfig) return null;
		const found = MOCK_MODELS.find(m => m.provider === modelConfig.provider && m.model === modelConfig.model);
		return found?.displayName ?? modelConfig.model;
	});
</script>

<div class="space-y-2">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium">模型</span>
		<span class="text-destructive text-xs">*</span>
	</div>
	<Select.Root 
		type="single"
		value={modelConfig ? `${modelConfig.provider}:${modelConfig.model}` : undefined}
		onValueChange={onModelChange}
	>
		<Select.Trigger class="h-9 w-full">
			{#if modelConfig}
				<div class="flex items-center gap-2">
					<Icon icon="mdi:robot" class="w-4 h-4 text-muted-foreground" />
					<span>{selectedModelDisplay}</span>
				</div>
			{:else}
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:alert" class="w-4 h-4 text-amber-500" />
					<span>选择模型</span>
				</div>
			{/if}
		</Select.Trigger>
		<Select.Content class="w-[var(--bits-floating-anchor-width)]">
			{#each MOCK_MODELS as model}
				<Select.Item value={`${model.provider}:${model.model}`} label={model.displayName ?? model.model}>
					<div class="flex items-center gap-2">
						<Icon icon="mdi:robot" class="w-4 h-4" />
						<span>{model.displayName ?? model.model}</span>
						<span class="text-xs text-muted-foreground ml-auto">{model.provider}</span>
					</div>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
