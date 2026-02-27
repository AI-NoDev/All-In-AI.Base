<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import type { ModelParams } from './types';

	interface Props {
		params: ModelParams;
		onParamsChange: (params: ModelParams) => void;
	}

	let { params, onParamsChange }: Props = $props();

	// 各参数是否启用
	let temperatureEnabled = $state(true);
	let maxTokensEnabled = $state(true);
	let topPEnabled = $state(true);

	function updateParam<K extends keyof ModelParams>(key: K, value: ModelParams[K]) {
		onParamsChange({ ...params, [key]: value });
	}
</script>

<div class="space-y-4">
	<div class="text-sm font-medium">参数</div>
	
	<!-- 温度 -->
	<div class="flex items-center gap-3">
		<Switch 
			checked={temperatureEnabled} 
			onCheckedChange={(v) => temperatureEnabled = v} 
			class="scale-75"
		/>
		<div class="flex items-center gap-1 w-20">
			<span class="text-sm text-muted-foreground">温度</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5 text-muted-foreground" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="max-w-xs text-xs">控制输出的随机性。较高的值会产生更多样化的输出，较低的值会产生更确定的输出。</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Slider
			value={[params.temperature]}
			onValueChange={(v) => updateParam('temperature', v[0])}
			min={0}
			max={2}
			step={0.1}
			disabled={!temperatureEnabled}
			class="flex-1"
		/>
		<Input
			type="number"
			value={params.temperature}
			oninput={(e) => updateParam('temperature', parseFloat((e.target as HTMLInputElement).value) || 0)}
			disabled={!temperatureEnabled}
			class="w-20 h-8 text-center"
			min={0}
			max={2}
			step={0.1}
		/>
	</div>

	<!-- 最大标记 -->
	<div class="flex items-center gap-3">
		<Switch 
			checked={maxTokensEnabled} 
			onCheckedChange={(v) => maxTokensEnabled = v}
			class="scale-75"
		/>
		<div class="flex items-center gap-1 w-20">
			<span class="text-sm text-muted-foreground">最大标记</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5 text-muted-foreground" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="max-w-xs text-xs">生成的最大 token 数量。较大的值允许更长的输出。</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Slider
			value={[params.maxTokens]}
			onValueChange={(v) => updateParam('maxTokens', v[0])}
			min={1}
			max={32000}
			step={1}
			disabled={!maxTokensEnabled}
			class="flex-1"
		/>
		<Input
			type="number"
			value={params.maxTokens}
			oninput={(e) => updateParam('maxTokens', parseInt((e.target as HTMLInputElement).value) || 1)}
			disabled={!maxTokensEnabled}
			class="w-20 h-8 text-center"
			min={1}
			max={32000}
		/>
	</div>

	<!-- Top P -->
	<div class="flex items-center gap-3">
		<Switch 
			checked={topPEnabled} 
			onCheckedChange={(v) => topPEnabled = v}
			class="scale-75"
		/>
		<div class="flex items-center gap-1 w-20">
			<span class="text-sm text-muted-foreground">Top P</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5 text-muted-foreground" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="max-w-xs text-xs">核采样参数。控制从概率最高的 token 中采样的范围。</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Slider
			value={[params.topP]}
			onValueChange={(v) => updateParam('topP', v[0])}
			min={0}
			max={1}
			step={0.01}
			disabled={!topPEnabled}
			class="flex-1"
		/>
		<Input
			type="number"
			value={params.topP}
			oninput={(e) => updateParam('topP', parseFloat((e.target as HTMLInputElement).value) || 0)}
			disabled={!topPEnabled}
			class="w-20 h-8 text-center"
			min={0}
			max={1}
			step={0.01}
		/>
	</div>
</div>
