<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import IconAdd from '@iconify-svelte/tdesign/add';
  import IconClose from '@iconify-svelte/tdesign/close';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { VariablePoolNodeData, VariableDefinition, VariableType } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: VariablePoolNodeData;
    isConnectable?: boolean;
  }

  /** Tooltip/Popover child snippet props type */
  type SnippetProps = { props: Record<string, unknown> };

  let { id, data, isConnectable = true }: Props = $props();

  // 可用的变量类型
  const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
    { value: 'string', label: '字符串' },
    { value: 'number', label: '数字' },
    { value: 'boolean', label: '布尔值' },
  ];

  // 添加新变量
  function addVariable() {
    const newKey = `var_${data.variables.length + 1}`;
    const newVar: VariableDefinition = {
      key: newKey,
      type: 'string',
      defaultValue: '',
    };
    data.onVariablesChange?.(id, [...data.variables, newVar]);
  }

  // 删除变量
  function removeVariable(index: number) {
    const newVars = data.variables.filter((_, i) => i !== index);
    data.onVariablesChange?.(id, newVars);
  }

  // 更新变量
  function updateVariable(index: number, field: keyof VariableDefinition, value: string | number | boolean | VariableType) {
    const newVars = [...data.variables];
    const variable = { ...newVars[index] };
    
    if (field === 'key') {
      variable.key = value as string;
    } else if (field === 'type') {
      variable.type = value as VariableType;
      // 重置默认值
      if (value === 'string') variable.defaultValue = '';
      else if (value === 'number') variable.defaultValue = 0;
      else if (value === 'boolean') variable.defaultValue = false;
    } else if (field === 'defaultValue') {
      variable.defaultValue = value;
    }
    
    newVars[index] = variable;
    data.onVariablesChange?.(id, newVars);
  }

  // 更新默认值（根据类型转换）
  function updateDefaultValue(index: number, inputValue: string) {
    const variable = data.variables[index];
    let value: string | number | boolean;
    
    if (variable.type === 'number') {
      value = inputValue === '' ? 0 : Number(inputValue);
    } else if (variable.type === 'boolean') {
      value = inputValue === 'true';
    } else {
      value = inputValue;
    }
    
    updateVariable(index, 'defaultValue', value);
  }

  // 获取默认值的显示字符串
  function getDefaultValueDisplay(variable: VariableDefinition): string {
    if (variable.type === 'boolean') {
      return variable.defaultValue ? 'true' : 'false';
    }
    return String(variable.defaultValue ?? '');
  }

  // 布局常量
  const HEADER_HEIGHT = 36;
  const ROW_HEIGHT = 56; // 增加高度以容纳两行
  const FOOTER_HEIGHT = 36;
</script>

<div class="min-w-[280px] bg-card border-2 border-chart-3 rounded-lg shadow-sm text-xs relative">
  <!-- 节点头部 - 作为拖拽区域 -->
  <div class="flex items-center gap-2 px-3 border-b border-chart-3/30 bg-chart-3/10 dark:bg-chart-3/20 rounded-t-lg cursor-grab active:cursor-grabbing" style="height: {HEADER_HEIGHT}px;">
    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-chart-3/20 text-chart-3 dark:bg-chart-3/30">
      VARS
    </span>
    <span class="font-medium text-card-foreground">变量池</span>
  </div>

  <!-- 变量列表 -->
  <div class="relative">
    {#each data.variables as variable, i}
      <div class="flex flex-col gap-1 px-2 pr-6 py-2 border-b border-border relative" style="min-height: {ROW_HEIGHT}px;">
        <!-- 第一行：变量名、类型、删除按钮 -->
        <div class="flex items-center gap-1">
          <!-- 变量名输入 -->
          <input
            type="text"
            class="nodrag nowheel w-24 text-[11px] px-1.5 py-1 border border-border rounded bg-card focus:outline-none focus:border-chart-3"
            value={variable.key}
            oninput={(e) => updateVariable(i, 'key', (e.target as HTMLInputElement).value)}
            placeholder="变量名"
          />
          <!-- 类型选择 -->
          <select
            class="nodrag nowheel flex-1 text-[11px] px-1 py-1 border border-border rounded bg-card focus:outline-none focus:border-chart-3"
            value={variable.type}
            onchange={(e) => updateVariable(i, 'type', (e.target as HTMLSelectElement).value as VariableType)}
          >
            {#each VARIABLE_TYPES as vt}
              <option value={vt.value}>{vt.label}</option>
            {/each}
          </select>
          <!-- 删除按钮 -->
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props }: SnippetProps)}
                <button
                  {...props}
                  class="nodrag w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  onclick={() => removeVariable(i)}
                >
                  <IconClose class="w-3 h-3" />
                </button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>删除变量</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
        <!-- 第二行：默认值输入 -->
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-muted-foreground w-12 shrink-0">默认值:</span>
          {#if variable.type === 'boolean'}
            <select
              class="nodrag nowheel flex-1 text-[11px] px-1 py-1 border border-border rounded bg-card focus:outline-none focus:border-chart-3"
              value={variable.defaultValue ? 'true' : 'false'}
              onchange={(e) => updateDefaultValue(i, (e.target as HTMLSelectElement).value)}
            >
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          {:else}
            <input
              type={variable.type === 'number' ? 'number' : 'text'}
              class="nodrag nowheel flex-1 text-[11px] px-1.5 py-1 border border-border rounded bg-card focus:outline-none focus:border-chart-3"
              value={getDefaultValueDisplay(variable)}
              oninput={(e) => updateDefaultValue(i, (e.target as HTMLInputElement).value)}
              placeholder={variable.type === 'number' ? '0' : '默认值'}
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- 输出 Handles - 放在节点外层以确保可连接 -->
  {#each data.variables as variable, i}
    <Handle
      id="output-{variable.key}"
      type="source"
      position={Position.Right}
      style="top: {HEADER_HEIGHT + ROW_HEIGHT * i + ROW_HEIGHT / 2}px; width: 10px; height: 10px; background: {getHandleColor(variable.type)}; border: none;"
      {isConnectable}
    />
  {/each}

  <!-- 添加变量按钮 -->
  <div class="flex items-center justify-center border-t border-chart-3/20" style="height: {FOOTER_HEIGHT}px;">
    <button
      class="nodrag flex items-center gap-1 px-3 py-1.5 text-[11px] text-chart-3 hover:bg-chart-3/10 rounded transition-colors"
      onclick={addVariable}
    >
      <IconAdd class="w-3 h-3" />
      添加变量
    </button>
  </div>
</div>
