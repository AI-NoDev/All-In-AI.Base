<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';

	interface Props {
		retryOnFailure: boolean;
		retryCount: number;
		retryInterval: number;
		onRetryOnFailureChange: (value: boolean) => void;
		onRetryCountChange: (value: number) => void;
		onRetryIntervalChange: (value: number) => void;
	}

	let { 
		retryOnFailure, 
		retryCount, 
		retryInterval, 
		onRetryOnFailureChange, 
		onRetryCountChange, 
		onRetryIntervalChange 
	}: Props = $props();
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-xs font-medium">失败时重试</span>
		<Switch 
			checked={retryOnFailure}
			onCheckedChange={onRetryOnFailureChange}
		/>
	</div>

	{#if retryOnFailure}
		<!-- 最大重试次数 -->
		<div class="flex items-center gap-3">
			<span class="text-xs text-muted-foreground w-20 shrink-0">最大重试次数</span>
			<div class="flex-1">
				<Slider 
					type="single"
					value={retryCount}
					min={1}
					max={10}
					step={1}
					onValueChange={onRetryCountChange}
				/>
			</div>
			<div class="flex items-center gap-1 w-16 shrink-0">
				<Input 
					type="number"
					value={retryCount}
					oninput={(e) => onRetryCountChange(parseInt((e.target as HTMLInputElement).value) || 3)}
					class="h-7 text-xs text-center px-1"
				/>
				<span class="text-xs text-muted-foreground">次</span>
			</div>
		</div>

		<!-- 重试间隔 -->
		<div class="flex items-center gap-3">
			<span class="text-xs text-muted-foreground w-20 shrink-0">重试间隔</span>
			<div class="flex-1">
				<Slider 
					type="single"
					value={retryInterval}
					min={100}
					max={10000}
					step={100}
					onValueChange={onRetryIntervalChange}
				/>
			</div>
			<div class="flex items-center gap-1 w-20 shrink-0">
				<Input 
					type="number"
					value={retryInterval}
					oninput={(e) => onRetryIntervalChange(parseInt((e.target as HTMLInputElement).value) || 1000)}
					class="h-7 text-xs text-center px-1"
				/>
				<span class="text-xs text-muted-foreground">毫秒</span>
			</div>
		</div>
	{/if}
</div>
