<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		instruction: string;
		onInstructionChange: (value: string) => void;
	}

	let { instruction, onInstructionChange }: Props = $props();

	let isExpanded = $state(false);
</script>

<div class="space-y-2">
	<button 
		class="flex items-center gap-1 text-xs font-medium hover:text-foreground transition-colors w-full"
		onclick={() => isExpanded = !isExpanded}
	>
		<Icon icon={isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"} class="w-4 h-4" />
		<span>高级设置</span>
	</button>

	{#if isExpanded}
		<div class="space-y-3 pl-5">
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">指令</span>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<button {...props} class="text-muted-foreground hover:text-foreground">
										<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
									</button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>自定义分类指令，用于指导模型如何进行分类</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<div class="flex items-center gap-1 text-muted-foreground text-xs">
						<span>{instruction.length}</span>
						<button class="hover:text-foreground">
							<Icon icon="mdi:code-braces" class="w-3.5 h-3.5" />
						</button>
						<button class="hover:text-foreground">
							<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
						</button>
						<button class="hover:text-foreground">
							<Icon icon="mdi:arrow-expand" class="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
				<Textarea 
					value={instruction}
					oninput={(e) => onInstructionChange((e.target as HTMLTextAreaElement).value)}
					placeholder={"在这里写你的提示词，输入'{' 插入变量、输入'/' 插入..."}
					rows={3}
					class="text-sm resize-none"
				/>
			</div>
		</div>
	{/if}
</div>
