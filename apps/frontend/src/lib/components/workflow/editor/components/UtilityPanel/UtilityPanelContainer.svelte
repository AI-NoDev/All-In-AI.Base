<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { utilityPanelState } from '../../contexts/index';
	import VariablesPanel from './VariablesPanel.svelte';
	import EnvironmentPanel from './EnvironmentPanel.svelte';
	import SystemPanel from './SystemPanel.svelte';
	import IssuesPanel from './IssuesPanel.svelte';

	interface Props {
		onSelectNode?: (nodeId: string) => void;
	}

	let { onSelectNode }: Props = $props();

	interface PanelConfig {
		title: string;
		description: string;
		icon: string;
		component: typeof VariablesPanel | typeof EnvironmentPanel | typeof SystemPanel | typeof IssuesPanel;
		hasAdd?: boolean;
	}

	const panelConfigs: Record<string, PanelConfig> = {
		variables: {
			title: '输入变量',
			description: '工作流输入参数',
			icon: 'mdi:variable-box',
			component: VariablesPanel,
			hasAdd: true
		},
		environment: {
			title: '环境变量',
			description: '运行时注入',
			icon: 'mdi:variable',
			component: EnvironmentPanel,
			hasAdd: true
		},
		system: {
			title: '系统变量',
			description: '只读系统参数',
			icon: 'mdi:cog-outline',
			component: SystemPanel,
			hasAdd: false
		},
		issues: {
			title: '问题列表',
			description: '验证错误和警告',
			icon: 'mdi:alert-circle-outline',
			component: IssuesPanel,
			hasAdd: false
		}
	};

	let activePanel = $derived(utilityPanelState.activePanel);
	let config = $derived(activePanel ? panelConfigs[activePanel] : null);

	// 用于触发子组件的添加操作
	let addTrigger = $state(0);

	function handleClose() {
		utilityPanelState.close();
	}

	function handleAdd() {
		addTrigger++;
	}
</script>

{#if activePanel && config}
	<Card.Root class="h-full flex flex-col shadow-lg relative">
		<!-- 关闭按钮浮动在右上角 -->
		<Button 
			variant="secondary" 
			size="icon" 
			class="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-10" 
			onclick={handleClose}
		>
			<Icon icon="mdi:close" width="14" height="14" />
		</Button>

		<!-- Header: 图标 + 标题 + 描述 + 添加按钮 -->
		<Card.Header class="pb-2 shrink-0">
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2 min-w-0">
					<Icon icon={config.icon} class="w-4 h-4 text-muted-foreground shrink-0" />
					<span class="text-sm font-medium shrink-0">{config.title}</span>
					<span class="text-xs text-muted-foreground shrink-0">·</span>
					<span class="text-xs text-muted-foreground truncate">{config.description}</span>
				</div>
				{#if config.hasAdd}
					<Button size="sm" variant="outline" class="h-7 text-xs shrink-0" onclick={handleAdd}>
						<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
						添加
					</Button>
				{/if}
			</div>
		</Card.Header>

		<Separator />

		<!-- Content -->
		<Card.Content class="flex-1 overflow-auto pt-4">
			{#if activePanel === 'issues'}
				<IssuesPanel {onSelectNode} />
			{:else}
				<svelte:component this={config.component} {addTrigger} />
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
