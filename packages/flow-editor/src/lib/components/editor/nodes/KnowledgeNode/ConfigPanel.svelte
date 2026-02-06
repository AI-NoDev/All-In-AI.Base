<script lang="ts">
	import type { KnowledgeNodeData } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	interface Props {
		nodeId: string;
		data: KnowledgeNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as KnowledgeNodeData | undefined;
	});

	let title = $derived(currentData?.title ?? '知识检索');
	let desc = $derived(currentData?.desc ?? '');
	let topK = $derived(currentData?.topK ?? 3);
	let scoreThreshold = $derived(currentData?.scoreThreshold ?? 0.5);

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
		<Label>返回数量 (Top K): {topK}</Label>
		<Slider 
			type="single"
			value={topK} 
			min={1} 
			max={10} 
			step={1}
			onValueChange={(v: number) => updateField('topK', v)}
		/>
	</div>

	<div class="space-y-2">
		<Label>相似度阈值: {scoreThreshold}</Label>
		<Slider 
			type="single"
			value={scoreThreshold} 
			min={0} 
			max={1} 
			step={0.05}
			onValueChange={(v: number) => updateField('scoreThreshold', v)}
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
</div>
