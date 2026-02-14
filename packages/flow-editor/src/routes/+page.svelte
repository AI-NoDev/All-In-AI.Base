<script lang="ts">
	import Editor from '$lib/components/editor/index.js';
	import type { NodeRunningParams } from '$lib/types/index.js';

	async function handleNodeRunning(params: NodeRunningParams): Promise<unknown> {
		console.log('Node running:', params);
		// 模拟异步执行
		await new Promise(resolve => setTimeout(resolve, 1000));
		return { success: true, nodeType: params.nodeType, isTest: params.isTest };
	}
</script>


<Editor onNodeRunning={handleNodeRunning}></Editor>
