<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		visionEnabled: boolean;
		reasoningTagsEnabled: boolean;
		/** 模型是否支持图片/视频输入 */
		supportsVision?: boolean;
		onVisionChange: (value: boolean) => void;
		onReasoningTagsChange: (value: boolean) => void;
	}

	let { visionEnabled, reasoningTagsEnabled, supportsVision = false, onVisionChange, onReasoningTagsChange }: Props = $props();
</script>

<!-- 视觉 -->
<div class="flex items-center justify-between">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium {!supportsVision ? 'text-muted-foreground' : ''}">视觉</span>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button {...props} class="text-muted-foreground hover:text-foreground">
						<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if supportsVision}
					启用后可处理图像输入
				{:else}
					当前模型不支持图像/视频输入
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<Switch 
		checked={visionEnabled}
		onCheckedChange={onVisionChange}
		disabled={!supportsVision}
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
