<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		addTrigger?: number;
	}

	let { addTrigger = 0 }: Props = $props();

	interface SystemVariable {
		name: string;
		description: string;
		example: string;
	}

	const systemVariables: SystemVariable[] = [
		{ name: 'sys.user_id', description: '当前用户 ID', example: 'user_abc123' },
		{ name: 'sys.conversation_id', description: '会话 ID', example: 'conv_xyz789' },
		{ name: 'sys.app_id', description: '应用 ID', example: 'app_def456' },
		{ name: 'sys.workflow_id', description: '工作流 ID', example: 'wf_ghi012' },
		{ name: 'sys.workflow_run_id', description: '工作流运行 ID', example: 'run_jkl345' },
		{ name: 'sys.timestamp', description: '当前时间戳', example: '1708934400000' },
		{ name: 'sys.date', description: '当前日期', example: '2026-02-25' },
		{ name: 'sys.time', description: '当前时间', example: '14:30:00' },
	];

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(`{{${text}}}`);
	}
</script>

<div class="space-y-2">
		{#each systemVariables as sysVar}
			<div class="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-mono text-sm font-medium text-primary">{sysVar.name}</span>
						</div>
						<p class="text-xs text-muted-foreground mt-1">{sysVar.description}</p>
						<p class="text-xs text-muted-foreground/70 mt-0.5">
							示例: <code class="px-1 py-0.5 bg-muted rounded">{sysVar.example}</code>
						</p>
					</div>
					<Button 
						size="icon" 
						variant="ghost" 
						class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
						onclick={() => copyToClipboard(sysVar.name)}
						title="复制引用"
					>
						<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
					</Button>
				</div>
			</div>
		{/each}
	</div>
