<script lang="ts">
	import type { ExceptionHandling } from '../types.js';
	import { EXCEPTION_HANDLING_OPTIONS } from '../types.js';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		exceptionHandling: ExceptionHandling;
		defaultValue: string;
		onExceptionHandlingChange: (value: ExceptionHandling) => void;
		onDefaultValueChange: (value: string) => void;
	}

	let { exceptionHandling, defaultValue, onExceptionHandlingChange, onDefaultValueChange }: Props = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1">
			<span class="text-xs font-medium">异常处理</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<button {...props} class="text-muted-foreground hover:text-foreground">
							<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
						</button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>节点执行失败时的处理方式</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Select.Root 
			type="single"
			value={exceptionHandling}
			onValueChange={(v) => v && onExceptionHandlingChange(v as ExceptionHandling)}
		>
			<Select.Trigger class="h-8 w-24 text-xs">
				{EXCEPTION_HANDLING_OPTIONS.find(o => o.value === exceptionHandling)?.label ?? '无'}
			</Select.Trigger>
			<Select.Content class="w-72">
				{#each EXCEPTION_HANDLING_OPTIONS as option}
					<Select.Item value={option.value} label={option.label}>
						<div class="space-y-0.5">
							<div class="font-medium">{option.label}</div>
							<div class="text-xs text-muted-foreground">{option.description}</div>
						</div>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if exceptionHandling === 'default_value'}
		<Input 
			value={defaultValue}
			oninput={(e) => onDefaultValueChange((e.target as HTMLInputElement).value)}
			placeholder="输入默认值"
			class="h-8 text-xs"
		/>
	{/if}
</div>
