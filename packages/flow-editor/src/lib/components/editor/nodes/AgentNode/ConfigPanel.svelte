<script lang="ts">
	import type { AgentNodeData } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	interface Props {
		nodeId: string;
		data: AgentNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as AgentNodeData | undefined;
	});

	let title = $derived(currentData?.title ?? 'Agent');
	let desc = $derived(currentData?.desc ?? '');
	let agentId = $derived(currentData?.agentId ?? '');
	let maxIterations = $derived(currentData?.maxIterations ?? 10);

	function updateField(field: string, value: unknown) {
		workflowState.updateNode(nodeId, { [field]: value });
	}
</script>

<div class="space-y-4">
	<div class="space-y-2">
		<Label for="title">节点名称</Label>
		<Input 
			id="title" 
			value={title} 
			oninput={(e) => updateField('title', (e.target as HTMLInputElement).value)}
			placeholder="输入节点名称"
		/>
	</div>

	<div class="space-y-2">
		<Label for="agentId">Agent ID</Label>
		<Input 
			id="agentId" 
			value={agentId} 
			oninput={(e) => updateField('agentId', (e.target as HTMLInputElement).value)}
			placeholder="选择或输入Agent ID"
		/>
	</div>

	<div class="space-y-2">
		<Label for="maxIterations">最大迭代次数: {maxIterations}</Label>
		<Slider
			type="single"
			value={maxIterations}
			min={1}
			max={50}
			step={1}
			onValueChange={(v: number) => updateField('maxIterations', v)}
		/>
	</div>

	<div class="space-y-2">
		<Label for="desc">描述</Label>
		<Textarea 
			id="desc" 
			value={desc} 
			oninput={(e) => updateField('desc', (e.target as HTMLTextAreaElement).value)}
			placeholder="输入节点描述"
			rows={2}
		/>
	</div>

	<div class="pt-4 border-t border-border">
		<p class="text-xs text-muted-foreground">
			Agent节点可以调用已配置的智能体来处理复杂任务。
		</p>
	</div>
</div>
