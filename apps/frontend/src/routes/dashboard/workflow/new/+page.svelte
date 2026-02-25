<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { WorkflowEditor } from '$lib/components/workflow';
  import { t } from '@/lib/stores/i18n.svelte';
  import type { Node, Edge } from '@xyflow/svelte';

  // LLM 调用函数
  async function handleLLMCall(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  }) {
    // TODO: 实现 LLM API 调用
    console.log('LLM Call:', params);
    return {
      content: '这是一个模拟的 LLM 响应',
      tokens: { prompt: 100, completion: 50, total: 150 },
    };
  }

  // Agent 调用函数
  async function handleAgentCall(params: {
    agentId: string;
    input: string;
    context?: Record<string, unknown>;
  }) {
    // TODO: 实现 Agent API 调用
    console.log('Agent Call:', params);
    return {
      output: '这是一个模拟的 Agent 响应',
      tokens: { prompt: 100, completion: 50, total: 150 },
    };
  }

  // 知识库检索函数
  async function handleKnowledgeRetrieval(params: {
    knowledgeBaseId: string;
    query: string;
    topK?: number;
  }) {
    // TODO: 实现知识库检索 API 调用
    console.log('Knowledge Retrieval:', params);
    return {
      results: [
        { content: '检索结果 1', score: 0.95 },
        { content: '检索结果 2', score: 0.85 },
      ],
    };
  }

  // 发布工作流
  async function handlePublish(workflow: { nodes: Node[]; edges: Edge[] }) {
    console.log('Publish workflow:', workflow);
    // TODO: 实现发布 API，创建新工作流
    alert(t('common.tips.operationSuccess'));
    goto('/dashboard/workflow');
  }

  // 保存草稿
  async function handleSaveDraft(workflow: { nodes: Node[]; edges: Edge[] }) {
    console.log('Save draft:', workflow);
    // TODO: 实现保存草稿 API
    alert(t('common.tips.operationSuccess'));
  }

  // 查看版本历史
  function handleVersionHistory() {
    // 新建工作流没有版本历史
  }

  function handleBack() {
    goto('/dashboard/workflow');
  }
</script>

<div class="flex flex-col h-full">
  <!-- 顶部导航栏 -->
  <div class="flex items-center gap-4 px-4 py-2 border-b bg-background">
    <Button variant="ghost" size="sm" onclick={handleBack}>
      <Icon icon="tdesign:chevron-left" class="size-4" />
      {t('common.actions.back')}
    </Button>
    <div class="flex items-center gap-2">
      <Icon icon="tdesign:flow" class="size-5 text-muted-foreground" />
      <span class="font-medium">{t('page.workflow.newWorkflow')}</span>
    </div>
  </div>

  <!-- 编辑器区域 -->
  <div class="flex-1 min-h-0">
    <WorkflowEditor
      llmCall={handleLLMCall}
      agentCall={handleAgentCall}
      knowledgeRetrieval={handleKnowledgeRetrieval}
      onPublish={handlePublish}
      onSaveDraft={handleSaveDraft}
      onVersionHistory={handleVersionHistory}
    />
  </div>
</div>
