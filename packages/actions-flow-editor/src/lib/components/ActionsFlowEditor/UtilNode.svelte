<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import IconLoading from '@iconify-svelte/tdesign/loading';
  import IconCheck from '@iconify-svelte/tdesign/check';
  import IconClose from '@iconify-svelte/tdesign/close';
  import IconBrowse from '@iconify-svelte/tdesign/browse';
  import * as Tooltip from '@qiyu-allinai/ui/components/tooltip/index.js';
  import type { UtilNodeData, BaseType, DebugStateGetter, OpenDebugDialogFn } from '../../types.js';
  import { UTIL_DEFINITIONS, DEBUG_STATE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: UtilNodeData;
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
      nodeName: `util:${data.utilType}`,
      nodeType: 'util',
      initialInput: {},
    });
  }

  // 获取工具定义
  let utilDef = $derived(UTIL_DEFINITIONS[data.utilType]);

  // 基础类型选项
  const BASE_TYPES: BaseType[] = ['string', 'number', 'boolean', 'object', 'array'];

  // 获取当前输入类型（用于 toString）
  let currentInputType = $derived(data.config.inputType ?? 'string');
  
  // 获取当前检查类型（用于 isType）
  let currentCheckType = $derived(data.config.checkType ?? 'string');

  // 计算实际的输入类型显示
  function getInputTypeDisplay(inputDef: { key: string; type: string; configurable?: boolean }): string {
    if (data.utilType === 'toString' && inputDef.configurable) {
      return currentInputType;
    }
    return inputDef.type;
  }

  // 布局常量
  const HEADER_HEIGHT = 36;
  const ROW_HEIGHT = 28;
  const PINS_PADDING_Y = 8;
  const CONFIG_HEIGHT = 32;

  // 计算 Handle 的 top 位置
  function getHandleTop(index: number, hasConfig: boolean): number {
    const configOffset = hasConfig ? CONFIG_HEIGHT : 0;
    return HEADER_HEIGHT + configOffset + PINS_PADDING_Y + index * ROW_HEIGHT + ROW_HEIGHT / 2;
  }

  // 是否显示配置区域
  let showConfig = $derived(data.utilType === 'toString' || data.utilType === 'isType');

  // 最大引脚数
  let maxPins = $derived(Math.max(utilDef.inputs.length, utilDef.outputs.length, 1));

  // 配置变更通过 data 的 onConfigChange 回调
  function handleInputTypeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newType = select.value as BaseType;
    if (data.onConfigChange) {
      data.onConfigChange(id, { ...data.config, inputType: newType });
    }
  }

  function handleCheckTypeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newType = select.value as BaseType;
    if (data.onConfigChange) {
      data.onConfigChange(id, { ...data.config, checkType: newType });
    }
  }

  // 删除确认
  function handleDelete() {
    if (confirm('确定要删除此节点吗？')) {
      data.onDelete?.(id);
    }
  }
</script>

<div class="min-w-[180px] bg-card border-2 border-chart-5 rounded-lg shadow-sm text-xs relative group {debugResult?.status === 'success' ? 'ring-2 ring-chart-2' : debugResult?.status === 'error' ? 'ring-2 ring-destructive' : ''}">
  <!-- 操作按钮组 -->
  <div class="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    <!-- 查看结果按钮 -->
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
    
    <!-- 运行按钮 -->
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
  <div class="flex items-center gap-2 px-3 border-b border-chart-5/30 bg-chart-5/10 dark:bg-chart-5/20 rounded-t-lg" style="height: {HEADER_HEIGHT}px;">
    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-chart-5/20 text-chart-5 dark:bg-chart-5/30">
      UTIL
    </span>
    <span class="font-medium text-card-foreground truncate">{utilDef.displayName}</span>
  </div>

  <!-- 配置区域 -->
  {#if showConfig}
    <div class="px-3 py-1.5 bg-chart-5/5 dark:bg-chart-5/10 border-b border-chart-5/20" style="height: {CONFIG_HEIGHT}px;">
      {#if data.utilType === 'toString'}
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-muted-foreground">输入类型:</span>
          <select
            class="flex-1 text-[11px] px-1.5 py-0.5 border border-border rounded bg-card focus:outline-none focus:border-chart-5"
            value={currentInputType}
            onchange={handleInputTypeChange}
          >
            {#each BASE_TYPES as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
        </div>
      {:else if data.utilType === 'isType'}
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-muted-foreground">检查类型:</span>
          <select
            class="flex-1 text-[11px] px-1.5 py-0.5 border border-border rounded bg-card focus:outline-none focus:border-chart-5"
            value={currentCheckType}
            onchange={handleCheckTypeChange}
          >
            {#each BASE_TYPES as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
  {/if}

  <!-- 引脚区域 -->
  <div style="padding: {PINS_PADDING_Y}px 0;">
    {#each { length: maxPins } as _, i}
      <div class="flex items-center justify-between px-3 gap-4" style="height: {ROW_HEIGHT}px;">
        <!-- 左侧输入标签 -->
        <span class="text-[11px] truncate">
          {#if utilDef.inputs[i]}
            <span class="text-destructive">{utilDef.inputs[i].required ? '*' : ''}</span>
            <span class="text-foreground">{utilDef.inputs[i].key}</span>
            <span class="text-muted-foreground">:{getInputTypeDisplay(utilDef.inputs[i])}</span>
          {/if}
        </span>
        <!-- 右侧输出标签 -->
        <span class="text-[11px] truncate text-right">
          {#if utilDef.outputs[i]}
            <span class="text-foreground">{utilDef.outputs[i].key}</span>
            <span class="text-muted-foreground">:{utilDef.outputs[i].type}</span>
          {/if}
        </span>
      </div>
    {/each}
  </div>

  <!-- 描述 -->
  <div class="px-3 py-2 text-muted-foreground text-[11px] border-t border-chart-5/20">
    {utilDef.description}
  </div>

  <!-- 输入 Handles -->
  {#each utilDef.inputs as input, i}
    <Handle
      id="input-{input.key}"
      type="target"
      position={Position.Left}
      style="top: {getHandleTop(i, showConfig)}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor(getInputTypeDisplay(input))}; border: none;"
      {isConnectable}
    />
  {/each}

  <!-- 输出 Handles -->
  {#each utilDef.outputs as output, i}
    <Handle
      id="output-{output.key}"
      type="source"
      position={Position.Right}
      style="top: {getHandleTop(i, showConfig)}px; right: 0px; width: 10px; height: 10px; background: {getHandleColor(output.type)}; border: none;"
      {isConnectable}
    />
  {/each}
</div>
