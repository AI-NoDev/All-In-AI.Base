<script lang="ts">
  import { Handle, Position, NodeResizer, type OnResize } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import IconLoading from '@iconify-svelte/tdesign/loading';
  import IconCheck from '@iconify-svelte/tdesign/check';
  import IconClose from '@iconify-svelte/tdesign/close';
  import IconBrowse from '@iconify-svelte/tdesign/browse';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { IfNodeData, DebugStateGetter, OpenDebugDialogFn } from '../../types.js';
  import { DEBUG_STATE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: IfNodeData;
    selected?: boolean;
    isConnectable?: boolean;
  }

  /** Tooltip/Popover child snippet props type */
  type SnippetProps = { props: Record<string, unknown> };

  let { id, data, selected = false, isConnectable = true }: Props = $props();

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
      nodeName: 'if',
      nodeType: 'if',
      initialInput: {},
    });
  }

  function handleDelete() {
    if (confirm('确定要删除条件节点吗？这将删除其中所有节点。')) {
      data.onDelete?.(id);
    }
  }

  function toggleElse() {
    data.onElseToggle?.(id, !data.hasElse);
  }

  // 布局常量
  const HEADER_HEIGHT = 40;
  const SUBFLOW_HEADER_HEIGHT = 28;
  const SUBFLOW_MIN_WIDTH = 280;
  const SUBFLOW_MIN_HEIGHT = 120;
  const SUBFLOW_GAP = 8;
  const PADDING = 16;

  // 固定部分高度
  let fixedHeight = $derived.by(() => {
    let h = HEADER_HEIGHT + PADDING;
    h += SUBFLOW_HEADER_HEIGHT; // if header
    if (data.hasElse) {
      h += SUBFLOW_GAP + SUBFLOW_HEADER_HEIGHT; // else header
    }
    h += PADDING / 2;
    return h;
  });

  // 最小节点尺寸
  let minNodeWidth = $derived(SUBFLOW_MIN_WIDTH + PADDING * 2);
  let minNodeHeight = $derived.by(() => {
    if (data.hasElse) {
      return fixedHeight + SUBFLOW_MIN_HEIGHT * 2;
    }
    return fixedHeight + SUBFLOW_MIN_HEIGHT;
  });

  // 处理 resize 事件
  const handleResize: OnResize = (_event, params) => {
    const { width: newWidth, height: newHeight } = params;
    const newSubflowWidth = Math.max(SUBFLOW_MIN_WIDTH, newWidth - PADDING * 2);
    let newIfHeight: number;
    let newElseHeight: number | undefined;
    
    if (data.hasElse) {
      const availableHeight = newHeight - fixedHeight;
      newIfHeight = Math.max(SUBFLOW_MIN_HEIGHT, Math.floor(availableHeight / 2));
      newElseHeight = newIfHeight;
    } else {
      newIfHeight = Math.max(SUBFLOW_MIN_HEIGHT, newHeight - fixedHeight);
    }
    
    data.onSizeChange?.(
      id, 
      { width: newSubflowWidth, height: newIfHeight },
      newElseHeight ? { width: newSubflowWidth, height: newElseHeight } : undefined
    );
  };
</script>

<NodeResizer 
  minWidth={minNodeWidth} 
  minHeight={minNodeHeight}
  isVisible={selected}
  lineStyle="border: 1px dashed var(--chart-4);"
  handleStyle="width: 8px; height: 8px; background: var(--chart-4); border-radius: 2px;"
  onResize={handleResize}
/>

<div 
  class="bg-card border-2 border-chart-4 rounded-lg shadow-md text-xs relative group flex flex-col {debugResult?.status === 'success' ? 'ring-2 ring-chart-2' : debugResult?.status === 'error' ? 'ring-2 ring-destructive' : ''}"
  style="width: 100%; height: 100%;"
>
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

  <!-- 节点头部（包含 condition 输入引脚） -->
  <div 
    class="flex items-center justify-between gap-2 px-3 border-b border-chart-4/30 rounded-t-lg shrink-0 bg-chart-4"
    style="height: {HEADER_HEIGHT}px;"
  >
    <div class="flex items-center gap-2">
      <!-- condition 输入标签 -->
      <span class="text-primary-foreground/80 text-[10px]">condition:</span>
      <span class="text-primary-foreground text-lg">◇</span>
      <span class="font-semibold text-primary-foreground text-sm">条件判断</span>
    </div>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props }: SnippetProps)}
          <button
            {...props}
            class="px-2 py-1 text-[10px] rounded transition-colors {data.hasElse ? 'bg-card/30 text-primary-foreground' : 'bg-card/10 text-primary-foreground/70 hover:bg-card/20'}"
            onclick={toggleElse}
          >
            {data.hasElse ? '✓ else' : '+ else'}
          </button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{data.hasElse ? '点击移除 else 分支' : '点击添加 else 分支'}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>

  <!-- SubFlows 区域 -->
  <div class="flex flex-col flex-1 p-2 gap-2 min-h-0">
    <!-- If SubFlow -->
    <div class="flex-1 bg-chart-2/5 dark:bg-chart-2/10 border border-chart-2/30 rounded-lg overflow-hidden flex flex-col min-h-0">
      <div 
        class="flex items-center gap-2 px-3 bg-chart-2/20 border-b border-chart-2/30 shrink-0"
        style="height: {SUBFLOW_HEADER_HEIGHT}px;"
      >
        <span class="text-chart-2">✓</span>
        <span class="font-medium text-chart-2 text-[11px]">if (true)</span>
      </div>
      <div class="flex-1 bg-chart-2/5 dark:bg-chart-2/10 flex items-center justify-center text-muted-foreground text-[11px] min-h-0">
        拖拽节点到此处
      </div>
    </div>

    <!-- Else SubFlow -->
    {#if data.hasElse}
      <div class="flex-1 bg-destructive/5 dark:bg-destructive/10 border border-destructive/30 rounded-lg overflow-hidden flex flex-col min-h-0">
        <div 
          class="flex items-center gap-2 px-3 bg-destructive/20 border-b border-destructive/30 shrink-0"
          style="height: {SUBFLOW_HEADER_HEIGHT}px;"
        >
          <span class="text-destructive">✗</span>
          <span class="font-medium text-destructive text-[11px]">else (false)</span>
        </div>
        <div class="flex-1 bg-destructive/5 dark:bg-destructive/10 flex items-center justify-center text-muted-foreground text-[11px] min-h-0">
          拖拽节点到此处
        </div>
      </div>
    {/if}
  </div>

  <!-- 输入 Handle: condition（放在 header 左侧中间） -->
  <Handle
    id="input-condition"
    type="target"
    position={Position.Left}
    style="top: {HEADER_HEIGHT / 2}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor('boolean')}; border: none;"
    {isConnectable}
  />
</div>
