<script lang="ts">
	import { Switch } from '@qiyu-allinai/ui/components/switch';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		visionEnabled: boolean;
		onVisionChange: (value: boolean) => void;
	}

	let { visionEnabled, onVisionChange }: Props = $props();
</script>

<div class="flex items-center justify-between py-1">
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
			<Tooltip.Content>启用后可以处理图像输入进行分类</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<Switch checked={visionEnabled} onCheckedChange={onVisionChange} />
</div>
