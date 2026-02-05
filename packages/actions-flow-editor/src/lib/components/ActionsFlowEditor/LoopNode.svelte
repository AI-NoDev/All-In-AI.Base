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
  import type { LoopNodeData, DebugStateGetter, OpenDebugDialogFn } from '../../types.js';
  import { DEBUG_STATE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: LoopNodeData;
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
      nodeName: 'loop',
      nodeType: 'loop',
      initialInput: {},
    });
  }

  function handleDelete() {
    if (confirm('确定要删除循环节点吗？这将删除其中所有节点。')) {
      data.onDelete?.(id);
    }
  }

  // 内部输出引脚（index + item）
  let internalOutputPins = $derived([
    { key: 'index', type: 'number' },
    { key: 'item', type: data.itemType || 'object' },
  ]);

  // 布局常量
  const HEADER_HEIGHT = 48;
  const SUBFLOW_MIN_WIDTH = 300;
  const SUBFLOW_MIN_HEIGHT = 150;
  const PADDING = 16;

  // 固定部分高度（不包括 SubFlow）
  let fixedHeight = $derived(HEADER_HEIGHT + PADDING);

  // 最小节点尺寸
  let minNodeWidth = $derived(Math.max(280, SUBFLOW_MIN_WIDTH + PADDING));
  let minNodeHeight = $derived(fixedHeight + SUBFLOW_MIN_HEIGHT);

  // 处理 resize 事件
  const handleResize: OnResize = (_event, params) => {
    const { width: newWidth, height: newHeight } = params;
    const newSubflowWidth = Math.max(SUBFLOW_MIN_WIDTH, newWidth - PADDING);
    const newSubflowHeight = Math.max(SUBFLOW_MIN_HEIGHT, newHeight - fixedHeight);
    data.onSizeChange?.(id, { width: newSubflowWidth, height: newSubflowHeight });
  };
</script>

<NodeResizer 
  minWidth={minNodeWidth} 
  minHeight={minNodeHeight}
  isVisible={selected}
  lineStyle="border: 1px dashed var(--primary);"
  handleStyle="width: 8px; height: 8px; background: var(--primary); border-radius: 2px;"
  onResize={handleResize}
/>

<div 
  class="bg-card border-2 border-primary rounded-lg shadow-md text-xs relative group flex flex-col {debugResult?.status === 'success' ? 'ring-2 ring-chart-2' : debugResult?.status === 'error' ? 'ring-2 ring-destructive' : ''}"
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

  <!-- 节点头部 -->
  <div 
    class="flex items-center gap-2 px-3 border-b border-primary/30 rounded-t-lg bg-primary"
    style="height: {HEADER_HEIGHT}px;"
  >
    <!-- 左侧：输入引脚区域 -->
    <div class="flex items-center gap-1">
      <span class="text-primary-foreground/80 text-[10px]">source</span>
      <span class="text-primary-foreground/60 text-[9px]">({data.inputType || 'number|array'})</span>
    </div>
    
    <!-- 中间：图标和标题 -->
    <div class="flex items-center gap-1 mx-auto">
      <span class="text-primary-foreground text-lg">↻</span>
      <span class="font-semibold text-primary-foreground text-sm">循环</span>
    </div>
    
    <!-- 右侧：输出引脚（item、index）向下 -->
    <div class="flex items-center gap-4">
      {#each internalOutputPins as pin}
        <div class="flex flex-col items-center relative pb-2">
          <span class="text-primary-foreground/90 text-[10px] font-medium">{pin.key}: <span class="text-primary-foreground/60 font-normal">{pin.type}</span></span>
          <!-- 向下的 Handle -->
          <Handle
            id="internal-output-{pin.key}"
            type="source"
            position={Position.Bottom}
            style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: {getHandleColor(pin.type)}; border: 2px solid var(--primary-foreground); border-radius: 50%;"
            {isConnectable}
          />
        </div>
      {/each}
    </div>
  </div>

  <!-- SubFlow 区域 -->
  <div 
    class="mx-2 my-2 bg-primary/5 dark:bg-primary/10 border border-primary/30 border-dashed rounded-lg flex-1 flex items-center justify-center text-muted-foreground text-[11px]"
  >
    拖拽节点到此处
  </div>

  <!-- 输入 Handle: source（放在 header 左侧） -->
  <Handle
    id="input-source"
    type="target"
    position={Position.Left}
    style="top: {HEADER_HEIGHT / 2}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor('number|array')}; border: none;"
    {isConnectable}
  />
</div>
