<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { onMount } from 'svelte';

	let primaryColor = $state('#1a1a2e');

	const STORAGE_KEY = 'flow-editor-theme';

	const presets = [
		{ name: '默认', color: '#1a1a2e' },
		{ name: '蓝色', color: '#2563eb' },
		{ name: '绿色', color: '#16a34a' },
		{ name: '紫色', color: '#7c3aed' },
		{ name: '橙色', color: '#ea580c' },
		{ name: '粉色', color: '#db2777' },
	];

	/**
	 * 获取 workflow editor 的容器元素
	 * 只在 workflow editor 范围内应用主题，不影响全局
	 */
	function getWorkflowContainer(): HTMLElement | null {
		return document.querySelector('.svelte-flow');
	}

	function applyTheme(color: string) {
		primaryColor = color;
		const container = getWorkflowContainer();
		if (container) {
			// 只在 workflow editor 容器上设置自定义属性
			container.style.setProperty('--workflow-primary', color);
		}
		localStorage.setItem(STORAGE_KEY, color);
	}

	function resetTheme() {
		localStorage.removeItem(STORAGE_KEY);
		const container = getWorkflowContainer();
		if (container) {
			container.style.removeProperty('--workflow-primary');
		}
		primaryColor = '#1a1a2e';
	}

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			primaryColor = saved;
			// 延迟应用，确保 DOM 已渲染
			requestAnimationFrame(() => {
				const container = getWorkflowContainer();
				if (container) {
					container.style.setProperty('--workflow-primary', saved);
				}
			});
		}
	});
</script>

{#if import.meta.env.DEV}
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<button
					{...props}
					class="svelte-flow__controls-button"
					title="主题编辑器"
				>
					<Icon icon="material-symbols:palette" width="16" height="16" />
				</button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-48 p-3" side="top" align="end">
			<div class="mb-2 text-xs font-medium text-foreground">主题色编辑器</div>

			<div class="mb-3 grid grid-cols-6 gap-1">
				{#each presets as preset}
					<button
						class="h-6 w-6 rounded border border-border transition-transform hover:scale-110"
						style="background-color: {preset.color}"
						onclick={() => applyTheme(preset.color)}
						title={preset.name}
					></button>
				{/each}
			</div>

			<div class="mb-3">
				<label for="theme-color-picker" class="mb-1 block text-xs text-muted-foreground">自定义颜色</label>
				<input
					id="theme-color-picker"
					type="color"
					bind:value={primaryColor}
					onchange={(e) => applyTheme(e.currentTarget.value)}
					class="h-8 w-full cursor-pointer rounded border border-border"
				/>
			</div>

			<Button variant="outline" size="sm" class="w-full" onclick={resetTheme}>
				<Icon icon="material-symbols:refresh" width="14" height="14" class="mr-1" />
				重置
			</Button>
		</Popover.Content>
	</Popover.Root>
{/if}
