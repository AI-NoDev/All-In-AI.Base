<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import IconLoading from '@iconify-svelte/tdesign/loading';
  import IconCheck from '@iconify-svelte/tdesign/check';
  import IconClose from '@iconify-svelte/tdesign/close';
  import IconBrowse from '@iconify-svelte/tdesign/browse';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { AssignNodeData, DebugStateGetter, OpenDebugDialogFn } from '../../types.js';
  import { DEBUG_STATE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: AssignNodeData;
    isConnectable?: boolean;
  }

  /** Tooltip/Popover child snippet props type */
  type SnippetProps = { props: Record<string, unknown> };

  let { id, data, isConnectable = true }: Props = $props();

  // 从 context 获取调试状态和打开对话框函数
  const getDebugState = getContext<DebugStateGetter | undefined>(DEBUG_STATE_CONTEXT_KEY);
  const openDebugDialog = getContext<OpenDebugDialogFn | undefined>(OPEN_DEBUG_DIALOG_CONTEXT_KEY);
  
  // 响应式获取当前节点的调试状态
  let debugResult = $derived(getDebugState?.()?.get(id));
  let isRunning = $derived(debugResult?.status === 'running');
  let hasDebug = $derived(!!openDebugDialog);
  let hasResult = $derived(debugResult?.status === 'success' || debugResult?.status === 'error');

  // 打开调试对话框
  function handleOpenDebugDialog(event: MouseEvent) {
    event.stopPropagation();
    if (!openDebugDialog || isRunning) return;
    
    openDebugDialog({
      nodeId: id,
      nodeName: 'assign',
      nodeType: 'assign',
      initialInput: {},
    });
  }

  // 获取当前选中的变量
  let selectedVariable = $derived(
    data.availableVariables.find((v) => v.key === data.targetVariableKey)
  );

  // 获取输入类型（根据选中的变量类型）
  let inputType = $derived(selectedVariable?.type ?? 'string');

  // 处理变量选择变更
  function handleTargetChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    data.onTargetChange?.(id, select.value);
  }

  // 删除确认
  function handleDelete() {
    if (confirm('确定要删除此赋值节点吗？')) {
      data.onDelete?.(id);
    }
  }

  // 布局常量
  const HEADER_HEIGHT = 36;
  const SELECT_HEIGHT = 40;
  const INPUT_HEIGHT = 28;
</script>

<div class="min-w-[180px] bg-card border-2 border-chart-4 rounded-lg shadow-sm text-xs relative group {debugResult?.status === 'success' ? 'ring-2 ring-chart-2' : debugResult?.status === 'error' ? 'ring-2 ring-destructive' : ''}">
  <!-- 操作按钮组 -->
  <div class="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    <!-- 查看结果按钮（运行成功/失败后显示） -->
    {#if hasResult && hasDebug}
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props }: SnippetProps)}
            <button
              {...props}
              class="w-5 h-5 rounded-full flex items-center justify-center transition-colors bg-muted hover:bg-muted/80 text-muted-foreground"
              onclick={handleOpenDebugDialog}
            >
              <IconBrowse class="w-3 h-3" />
            </button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>查看输入输出</p>
        </Tooltip.Content>
      </Tooltip.Root>
    {/if}
    
    <!-- 调试按钮 -->
    {#if hasDebug}
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props }: SnippetProps)}
            <button
              {...props}
              class="w-5 h-5 rounded-full flex items-center justify-center transition-colors {isRunning ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-primary-foreground"
              onclick={handleOpenDebugDialog}
              disabled={isRunning}
            >
              {#if isRunning}
                <IconLoading class="w-3 h-3 animate-spin" />
              {:else}
                <IconPlay class="w-3 h-3" />
              {/if}
            </button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{isRunning ? '运行中...' : '调试节点'}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    {/if}
    
    <!-- 删除按钮 -->
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props }: SnippetProps)}
          <button
            {...props}
            class="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
            onclick={handleDelete}
          >
            <IconDelete class="w-3 h-3" />
          </button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>删除节点</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
  
  <!-- 调试状态指示器 -->
  {#if debugResult?.status === 'success'}
    <div class="absolute -top-2 -left-2 w-5 h-5 bg-chart-2 text-primary-foreground rounded-full flex items-center justify-center z-10">
      <IconCheck class="w-3 h-3" />
    </div>
  {:else if debugResult?.status === 'error'}
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props }: SnippetProps)}
          <div {...props} class="absolute -top-2 -left-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center z-10 cursor-help">
            <IconClose class="w-3 h-3" />
          </div>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p class="max-w-[200px] break-words">{debugResult.error || '执行失败'}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}

  <!-- 节点头部 -->
  <div class="flex items-center gap-2 px-3 border-b border-chart-4/30 bg-chart-4/10 dark:bg-chart-4/20 rounded-t-lg" style="height: {HEADER_HEIGHT}px;">
    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-chart-4/20 text-chart-4 dark:bg-chart-4/30">
      SET
    </span>
    <span class="font-medium text-card-foreground">赋值</span>
  </div>

  <!-- 变量选择区域 -->
  <div class="px-3 py-2 border-b border-border" style="height: {SELECT_HEIGHT}px;">
    {#if data.availableVariables.length > 0}
      <select
        class="w-full text-[11px] px-2 py-1.5 border border-border rounded bg-card focus:outline-none focus:border-chart-4"
        value={data.targetVariableKey}
        onchange={handleTargetChange}
      >
        <option value="">选择变量...</option>
        {#each data.availableVariables as variable}
          <option value={variable.key}>
            {variable.key} ({variable.type})
          </option>
        {/each}
      </select>
    {:else}
      <div class="text-[11px] text-muted-foreground py-1.5">
        请先添加变量池
      </div>
    {/if}
  </div>

  <!-- 输入引脚区域 -->
  <div class="flex items-center px-3" style="height: {INPUT_HEIGHT}px;">
    <span class="text-[11px]">
      <span class="text-destructive">*</span>
      <span class="text-foreground">value</span>
      <span class="text-muted-foreground">:{inputType}</span>
    </span>
  </div>

  <!-- 输入 Handle -->
  <Handle
    id="input-value"
    type="target"
    position={Position.Left}
    style="top: {HEADER_HEIGHT + SELECT_HEIGHT + INPUT_HEIGHT / 2}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor(inputType)}; border: none;"
    {isConnectable}
  />
</div>
