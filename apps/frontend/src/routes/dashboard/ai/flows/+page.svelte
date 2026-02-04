<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { ActionsFlowEditor } from '@qiyu-allinai/actions-flow-editor';
  import type { ActionSummary, ActionDetail, JsonSchemaProperty, WorkflowDefinition } from '@qiyu-allinai/actions-flow-editor';

  interface ApiResponse<T> {
    data: T | null;
    status: number;
    message: string;
  }

  let actions = $state<ActionSummary[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // 示例 inputSchema：流程的输入参数定义
  const exampleInputSchema: Record<string, JsonSchemaProperty> = {
    userId: { 
      type: 'string', 
      format: 'uuid',
      description: '用户ID' 
    },
    userName: { 
      type: 'string', 
      minLength: 1, 
      maxLength: 50,
      description: '用户名' 
    },
    email: { 
      type: 'string', 
      format: 'email',
      description: '邮箱地址' 
    },
  };

  async function loadActions() {
    try {
      loading = true;
      const res = await fetch('/api/actions');
      const json: ApiResponse<ActionSummary[]> = await res.json();
      actions = json.data ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : '加载 Actions 失败';
    } finally {
      loading = false;
    }
  }

  async function getActionDetail(name: string): Promise<ActionDetail> {
    const res = await fetch(`/api/actions/${encodeURIComponent(name)}`);
    const json: ApiResponse<ActionDetail> = await res.json();
    if (json.data) return json.data;
    throw new Error('Action not found');
  }

  // 连接错误处理
  function handleConnectionError(reason: string) {
    alert(reason);
  }

  // 节点运行处理（调试用）- 使用 sandbox 模式调用后端 API
  async function handleRunNode(nodeName: string, input: Record<string, unknown>): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Sandbox': 'true',
    };
    
    const token = authStore.accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`/api/actions/execute/${encodeURIComponent(nodeName)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    
    const json: ApiResponse<unknown> = await res.json();
    
    if (!res.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    
    return json.data;
  }

  // 工作流变更处理
  function handleWorkflowChange(workflow: WorkflowDefinition) {
    console.log('Workflow changed:', workflow);
  }

  onMount(() => {
    loadActions();
  });
</script>

<div class="flex flex-1 min-h-0 -mx-4 lg:-mx-6 -mb-4">
  {#if loading}
    <div class="flex items-center justify-center w-full h-full">
      <span class="text-muted-foreground">加载中...</span>
    </div>
  {:else if error}
    <div class="flex flex-col items-center justify-center w-full h-full gap-2">
      <span class="text-destructive">⚠️ {error}</span>
      <button class="text-sm text-primary hover:underline" onclick={() => loadActions()}>
        重试
      </button>
    </div>
  {:else}
    <ActionsFlowEditor 
      {actions} 
      {getActionDetail}
      inputSchema={exampleInputSchema}
      onWorkflowChange={handleWorkflowChange}
      onConnectionError={handleConnectionError}
      onRunNode={handleRunNode}
    />
  {/if}
</div>
