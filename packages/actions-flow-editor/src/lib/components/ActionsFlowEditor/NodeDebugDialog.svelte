<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import IconLoading from '@iconify-svelte/tdesign/loading';
  import IconRefresh from '@iconify-svelte/tdesign/refresh';
  import type { NodeDebugResult } from '../../types.js';
  import { generateMockInput } from '../../utils/schemaFaker.js';

  interface InputSchema {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  }

  interface Props {
    open: boolean;
    nodeId: string;
    nodeName: string;
    nodeType: string;
    initialInput: Record<string, unknown>;
    /** Action 节点的输入 Schema（用于生成模拟数据） */
    inputSchema?: InputSchema;
    debugResult?: NodeDebugResult;
    onClose: () => void;
    onRun: (input: Record<string, unknown>) => Promise<void>;
  }

  let { 
    open = $bindable(false), 
    nodeId, 
    nodeName, 
    nodeType,
    initialInput,
    inputSchema,
    debugResult,
    onClose,
    onRun
  }: Props = $props();

  // 输入 JSON 字符串（可编辑）
  let inputJson = $state('{}');
  let inputError = $state<string | null>(null);
  let isRunning = $state(false);

  // 当 dialog 打开时，初始化输入（优先使用已有输入，否则生成模拟数据）
  $effect(() => {
    if (open) {
      // 如果有已有输入且不为空对象，使用已有输入
      if (initialInput && Object.keys(initialInput).length > 0) {
        inputJson = JSON.stringify(initialInput, null, 2);
      } else if (inputSchema) {
        // 否则根据 schema 生成模拟数据
        const mockData = generateMockInput(inputSchema);
        inputJson = JSON.stringify(mockData, null, 2);
      } else {
        inputJson = '{}';
      }
      inputError = null;
    }
  });

  // 重新生成模拟数据
  function handleGenerateMock() {
    if (!inputSchema) return;
    const mockData = generateMockInput(inputSchema);
    inputJson = JSON.stringify(mockData, null, 2);
    inputError = null;
  }

  // 输出 JSON（只读）
  let outputJson = $derived.by(() => {
    if (!debugResult) return '';
    if (debugResult.status === 'success' && debugResult.output !== undefined) {
      return JSON.stringify(debugResult.output, null, 2);
    }
    if (debugResult.status === 'error') {
      return debugResult.error || '执行失败';
    }
    return '';
  });

  // 验证并解析输入 JSON
  function parseInput(): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(inputJson);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        inputError = '输入必须是一个对象';
        return null;
      }
      inputError = null;
      return parsed;
    } catch (e) {
      inputError = 'JSON 格式错误';
      return null;
    }
  }

  // 运行节点
  async function handleRun() {
    const input = parseInput();
    if (!input) return;
    
    isRunning = true;
    try {
      await onRun(input);
    } finally {
      isRunning = false;
    }
  }

  // 关闭对话框
  function handleClose() {
    open = false;
    onClose();
  }

  // 状态颜色
  let statusColor = $derived.by(() => {
    if (!debugResult) return 'bg-accent text-muted-foreground';
    if (debugResult.status === 'running') return 'bg-primary/20 text-primary';
    if (debugResult.status === 'success') return 'bg-chart-2/20 text-chart-2';
    if (debugResult.status === 'error') return 'bg-destructive/20 text-destructive';
    return 'bg-accent text-muted-foreground';
  });

  let statusText = $derived.by(() => {
    if (!debugResult) return '未运行';
    if (debugResult.status === 'running') return '运行中...';
    if (debugResult.status === 'success') return '成功';
    if (debugResult.status === 'error') return '失败';
    return '未知';
  });
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) handleClose(); }}>
  <Dialog.Content class="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <span>节点调试</span>
        <span class="text-sm font-normal text-muted-foreground">#{nodeId.slice(0, 8)}</span>
      </Dialog.Title>
      <Dialog.Description class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-xs font-medium bg-accent text-foreground">{nodeType}</span>
        <span class="text-muted-foreground">{nodeName}</span>
        <span class="px-2 py-0.5 rounded text-xs font-medium {statusColor}">{statusText}</span>
      </Dialog.Description>
    </Dialog.Header>

    <div class="flex-1 overflow-auto grid grid-cols-2 gap-4 mt-4 min-h-0">
      <!-- 输入区域 -->
      <div class="flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-foreground">输入 (Input)</label>
          <div class="flex items-center gap-2">
            {#if inputSchema}
              <button
                type="button"
                class="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                onclick={handleGenerateMock}
                title="重新生成模拟数据"
              >
                <IconRefresh class="w-3 h-3" />
                生成模拟
              </button>
            {/if}
            {#if inputError}
              <span class="text-xs text-destructive">{inputError}</span>
            {/if}
          </div>
        </div>
        <textarea
          class="flex-1 min-h-[200px] p-3 text-xs font-mono border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary {inputError ? 'border-destructive bg-destructive/5' : 'border-border bg-muted'}"
          bind:value={inputJson}
          placeholder={`{}`}
          spellcheck="false"
        ></textarea>
      </div>

      <!-- 输出区域 -->
      <div class="flex flex-col min-h-0">
        <label class="text-sm font-medium text-foreground mb-2">输出 (Output)</label>
        <textarea
          class="flex-1 min-h-[200px] p-3 text-xs font-mono border border-border rounded-lg resize-none bg-accent text-foreground cursor-not-allowed"
          value={outputJson}
          placeholder="运行后显示输出..."
          readonly
          disabled
        ></textarea>
      </div>
    </div>

    <Dialog.Footer class="mt-4">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        onclick={handleClose}
      >
        关闭
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={handleRun}
        disabled={isRunning || !!inputError}
      >
        {#if isRunning}
          <IconLoading class="w-4 h-4 animate-spin" />
          运行中...
        {:else}
          <IconPlay class="w-4 h-4" />
          运行
        {/if}
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
