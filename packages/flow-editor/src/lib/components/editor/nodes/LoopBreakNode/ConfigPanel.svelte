<script lang="ts">
	import { Label } from '@qiyu-allinai/ui/components/label/index.js';
	import { Input } from '@qiyu-allinai/ui/components/input/index.js';
	import { Textarea } from '@qiyu-allinai/ui/components/textarea/index.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import type { LoopBreakNodeData } from './types.js';

	interface Props {
		nodeId: string;
	}

	let { nodeId }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return (node?.data as LoopBreakNodeData) ?? { title: '退出循环', type: 'loop-break' };
	});

	function updateData(updates: Partial<LoopBreakNodeData>) {
		workflowState.updateNode(nodeId, updates);
	}
</script>

<div class="space-y-4">
	<!-- 节点标题 -->
	<div class="space-y-2">
		<Label for="title">节点名称</Label>
		<Input
			id="title"
			value={currentData.title}
			oninput={(e) => updateData({ title: e.currentTarget.value })}
			placeholder="退出循环"
		/>
	</div>

	<!-- 退出原因 -->
	<div class="space-y-2">
		<Label for="reason">退出原因（可选）</Label>
		<Textarea
			id="reason"
			value={currentData.reason ?? ''}
			oninput={(e) => updateData({ reason: e.currentTarget.value || undefined })}
			placeholder="描述退出循环的原因..."
			rows={3}
		/>
	</div>

	<!-- 说明 -->
	<div class="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
		<p>当执行到此节点时，将立即退出当前循环，继续执行循环后的节点。</p>
	</div>
</div>
