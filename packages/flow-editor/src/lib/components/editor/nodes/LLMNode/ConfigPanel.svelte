<script lang="ts">
	import type { LLMNodeData } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	interface Props {
		nodeId: string;
		data: LLMNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as LLMNodeData | undefined;
	});

	let title = $derived(currentData?.title ?? 'LLM');
	let desc = $derived(currentData?.desc ?? '');
	let model = $derived(currentData?.model ?? 'gpt-4');
	let temperature = $derived(currentData?.temperature ?? 0.7);
	let systemPrompt = $derived(currentData?.systemPrompt ?? '');

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
		<Label for="model">模型</Label>
		<Input 
			id="model" 
			value={model} 
			oninput={(e) => updateField('model', (e.target as HTMLInputElement).value)}
			placeholder="选择模型"
		/>
	</div>

	<div class="space-y-2">
		<Label>温度: {temperature}</Label>
		<Slider 
			type="single"
			value={temperature} 
			min={0} 
			max={2} 
			step={0.1}
			onValueChange={(v: number) => updateField('temperature', v)}
		/>
	</div>

	<div class="space-y-2">
		<Label for="systemPrompt">系统提示词</Label>
		<Textarea 
			id="systemPrompt" 
			value={systemPrompt} 
			oninput={(e) => updateField('systemPrompt', (e.target as HTMLTextAreaElement).value)}
			placeholder="输入系统提示词"
			rows={4}
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
