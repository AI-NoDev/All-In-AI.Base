<script lang="ts">
	import { Switch } from '@qiyu-allinai/ui/components/switch';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		visionEnabled: boolean;
		reasoningTagsEnabled: boolean;
		onVisionChange: (value: boolean) => void;
		onReasoningTagsChange: (value: boolean) => void;
	}

	let { visionEnabled, reasoningTagsEnabled, onVisionChange, onReasoningTagsChange }: Props = $props();
</script>

<!-- 视觉 -->
<div class="flex items-center justify-between">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium">视觉</span>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button {...props} class="text-muted-foreground hover:text-foreground">
						<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>启用后可处理图像输入</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<Switch 
		checked={visionEnabled}
		onCheckedChange={onVisionChange}
	/>
</div>

<!-- 启用推理标签分离 -->
<div class="flex items-center justify-between">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium">启用推理标签分离</span>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button {...props} class="text-muted-foreground hover:text-foreground">
						<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>分离模型的思考过程和最终输出</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<Switch 
		checked={reasoningTagsEnabled}
		onCheckedChange={onReasoningTagsChange}
	/>
</div>
