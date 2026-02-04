<script lang="ts">
  import { onMount } from 'svelte';
  import * as Sheet from '@/lib/components/ui/sheet';
  import { Button } from '@/lib/components/ui/button';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { preferencesStore } from '@/lib/stores/preferences.svelte';
  import { ActionsFlowEditor } from '@qiyu-allinai/actions-flow-editor';
  import type { ActionSummary, ActionDetail, WorkflowDefinition } from '@qiyu-allinai/actions-flow-editor';

  interface ApiResponse<T> {
    data: T | null;
    status: number;
    message: string;
  }

  interface Props {
    open: boolean;
    initialWorkflow: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: (workflow: string) => void;
  }

  let { open, initialWorkflow, onOpenChange, onConfirm }: Props = $props();

  let actions = $state<ActionSummary[]>([]);
  let loading = $state(true);
  let workflow = $state<WorkflowDefinition | undefined>(undefined);

  // 从 preferencesStore 获取当前主题
  let colorMode = $derived<'light' | 'dark'>(preferencesStore.theme);

  // 解析初始工作流
  $effect(() => {
    if (open && initialWorkflow) {
      try {
        workflow = JSON.parse(initialWorkflow);
      } catch {
        workflow = undefined;
      }
    } else if (open) {
      workflow = undefined;
    }
  });

  async function loadActions() {
    try {
      loading = true;
      const res = await fetch('/api/actions');
      const json: ApiResponse<ActionSummary[]> = await res.json();
      actions = json.data ?? [];
    } catch (e) {
      console.error('Failed to load actions:', e);
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

  function handleConnectionError(reason: string) {
    alert(reason);
  }

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

  function handleWorkflowChange(newWorkflow: WorkflowDefinition) {
    workflow = newWorkflow;
  }

  function handleConfirm() {
    if (workflow) {
      onConfirm(JSON.stringify(workflow, null, 2));
    } else {
      onConfirm('');
    }
    onOpenChange(false);
  }

  onMount(() => {
    loadActions();
  });
</script>

<Sheet.Root {open} onOpenChange={onOpenChange}>
  <Sheet.Content side="right" class="w-[90vw] sm:max-w-[90vw] p-0 flex flex-col" interactOutsideBehavior="ignore">
    <Sheet.Header class="px-6 py-4 border-b shrink-0">
      <Sheet.Title>流程编辑器</Sheet.Title>
      <Sheet.Description>
        使用可视化编辑器定义工具的执行流程
      </Sheet.Description>
    </Sheet.Header>
    
    <div class="flex-1 min-h-0">
      {#if loading}
        <div class="flex items-center justify-center h-full">
          <span class="text-muted-foreground">加载中...</span>
        </div>
      {:else}
        <ActionsFlowEditor 
          {actions} 
          {getActionDetail}
          {colorMode}
          initialWorkflow={workflow}
          onWorkflowChange={handleWorkflowChange}
          onConnectionError={handleConnectionError}
          onRunNode={handleRunNode}
        />
      {/if}
    </div>

    <div class="px-6 py-4 border-t bg-background shrink-0">
      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
        <Button onclick={handleConfirm}>确认保存</Button>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>
