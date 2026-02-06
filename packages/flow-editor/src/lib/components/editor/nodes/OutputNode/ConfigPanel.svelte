<script lang="ts">
	import type { OutputNodeData } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		nodeId: string;
		data: OutputNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as OutputNodeData | undefined;
	});

	let title = $derived(currentData?.title ?? '输出');
	let desc = $derived(currentData?.desc ?? '');
	let outputVariable = $derived(currentData?.outputVariable ?? '');

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
		<Label for="outputVariable">输出变量</Label>
		<Input 
			id="outputVariable" 
			value={outputVariable} 
			oninput={(e) => updateField('outputVariable', (e.target as HTMLInputElement).value)}
			placeholder="输入输出变量名"
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
			输出节点是工作流的终点，用于返回最终结果。
		</p>
	</div>
</div>
