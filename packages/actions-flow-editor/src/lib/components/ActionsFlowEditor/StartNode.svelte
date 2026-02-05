<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconChevronRight from '@iconify-svelte/tdesign/chevron-right';
  import IconChevronDown from '@iconify-svelte/tdesign/chevron-down';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { StartNodeData, JsonSchemaProperty, EdgesGetter } from '../../types.js';
  import { EDGES_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor, getTypeColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: StartNodeData;
    isConnectable?: boolean;
  }

  /** Tooltip/Popover child snippet props type */
  type SnippetProps = { props: Record<string, unknown> };

  let { id, data, isConnectable = true }: Props = $props();

  /** 引脚信息 */
  interface PinInfo {
    key: string;
    type: string;
    schema?: JsonSchemaProperty;
    depth: number;
    expandable: boolean;
    parentPath?: string;
    description?: string;
  }

  // 展开状态
  let expandedPaths = $state<Set<string>>(new Set());

  // 从 context 获取 edges getter 函数
  const getEdges = getContext<EdgesGetter>(EDGES_CONTEXT_KEY);
  
  // 响应式获取 edges
  let edges = $derived(getEdges?.() ?? []);

  // 计算当前节点所有有连接的输出引脚路径
  let connectedOutputPaths = $derived.by(() => {
    const paths = new Set<string>();
    for (const e of edges) {
      if (e.source === id && e.sourceHandle) {
        const pinKey = e.sourceHandle.replace('output-', '');
        paths.add(pinKey);
      }
    }
    return paths;
  });

  // 计算需要自动展开的路径（基于已连接的引脚）
  let autoExpandPaths = $derived.by(() => {
    const pathsToExpand = new Set<string>();
    for (const path of connectedOutputPaths) {
      if (path.includes('.')) {
        const parts = path.split('.');
        for (let i = 1; i < parts.length; i++) {
          const parentPath = parts.slice(0, i).join('.');
          pathsToExpand.add(parentPath);
        }
      }
    }
    return pathsToExpand;
  });

  // 合并手动展开和自动展开的路径
  let effectiveExpandedPaths = $derived(new Set([...expandedPaths, ...autoExpandPaths]));

  // 检查某个路径及其所有子路径是否有连接
  function hasConnectionInSubtree(basePath: string): boolean {
    const prefix = basePath + '.';
    for (const path of connectedOutputPaths) {
      if (path === basePath || path.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  // 切换展开/收起
  function toggleExpand(path: string) {
    if (expandedPaths.has(path)) {
      // 尝试收起 - 检查是否有子路径有连接
      if (hasConnectionInSubtree(path)) {
        return; // 有连接，不允许收起
      }
      const newSet = new Set(expandedPaths);
      // 收起时也要收起所有子路径
      for (const p of newSet) {
        if (p === path || p.startsWith(path + '.')) {
          newSet.delete(p);
        }
      }
      expandedPaths = newSet;
    } else {
      // 展开
      const newSet = new Set(expandedPaths);
      newSet.add(path);
      expandedPaths = newSet;
    }
  }

  // 获取 JSON Schema 类型的显示字符串
  function getTypeDisplay(prop: JsonSchemaProperty): string {
    // 处理 anyOf/oneOf (union types)
    const unionTypes = prop.anyOf ?? prop.oneOf;
    if (unionTypes && Array.isArray(unionTypes)) {
      const types: string[] = [];
      for (const item of unionTypes) {
        const itemType = getTypeDisplay(item as JsonSchemaProperty);
        if (itemType && !types.includes(itemType)) {
          types.push(itemType);
        }
      }
      if (types.length > 0) {
        return types.join('|');
      }
    }
    
    // 处理 const (literal)
    if (prop.const !== undefined) {
      if (typeof prop.const === 'string') return 'string';
      if (typeof prop.const === 'number') return 'number';
      if (typeof prop.const === 'boolean') return 'boolean';
      return 'string';
    }
    
    // 处理 array
    if (prop.type === 'array' && prop.items) {
      const items = prop.items as JsonSchemaProperty;
      const itemType = getTypeDisplay(items);
      return `array<${itemType}>`;
    }
    
    // 处理基本类型
    if (prop.type === 'integer') return 'number';
    return prop.type || 'unknown';
  }

  // 检查是否为可展开的 object
  function isExpandableObject(prop: JsonSchemaProperty): boolean {
    if (prop.type !== 'object') return false;
    return !!(prop.properties && Object.keys(prop.properties).length > 0);
  }

  // 递归生成引脚信息
  function generatePins(
    schema: Record<string, JsonSchemaProperty> | undefined,
    basePath: string = '',
    depth: number = 0
  ): PinInfo[] {
    if (!schema) return [];
    
    const pins: PinInfo[] = [];
    
    for (const [key, prop] of Object.entries(schema)) {
      const fullPath = basePath ? `${basePath}.${key}` : key;
      const type = getTypeDisplay(prop);
      const expandable = isExpandableObject(prop);
      
      pins.push({
        key: fullPath,
        type,
        schema: prop,
        depth,
        expandable,
        parentPath: basePath || undefined,
        description: prop.description,
      });
      
      // 如果已展开，递归添加子字段
      if (expandable && effectiveExpandedPaths.has(fullPath) && prop.properties) {
        const childPins = generatePins(prop.properties, fullPath, depth + 1);
        pins.push(...childPins);
      }
    }
    
    return pins;
  }

  // 输出引脚信息
  let outputPins = $derived.by(() => {
    return generatePins(data.inputSchema);
  });

  // 布局常量（与 ActionNode 保持一致）
  const HEADER_HEIGHT = 40;
  const ROW_HEIGHT = 24;
  const PINS_PADDING_Y = 8;
  const HANDLE_SIZE = 10;

  // 计算 Handle 的 top 位置（相对于节点）
  function getHandleTop(index: number): number {
    return HEADER_HEIGHT + PINS_PADDING_Y + index * ROW_HEIGHT + ROW_HEIGHT / 2;
  }

  // 获取显示的键名（只显示最后一部分）
  function getDisplayKey(pin: PinInfo): string {
    const parts = pin.key.split('.');
    return parts[parts.length - 1];
  }
</script>

<div class="min-w-[180px] rounded-lg shadow-md text-primary-foreground relative bg-primary">
  <!-- 节点头部 -->
  <div class="flex items-center gap-2 px-3.5 font-semibold" style="height: {HEADER_HEIGHT}px;">
    <IconPlay class="w-4 h-4" />
    <span class="text-sm">开始</span>
  </div>

  <!-- 引脚区域 -->
  {#if outputPins.length > 0}
    <div class="bg-card rounded-b-lg text-foreground" style="padding: {PINS_PADDING_Y}px 0;">
      {#each outputPins as pin}
        {@const isExpanded = effectiveExpandedPaths.has(pin.key)}
        {@const canCollapse = !hasConnectionInSubtree(pin.key)}
        <div 
          class="flex items-center justify-end gap-1 px-3.5" 
          style="height: {ROW_HEIGHT}px; padding-left: {12 + pin.depth * 12}px;"
        >
          <!-- 展开/收起按钮 -->
          {#if pin.expandable}
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#snippet child({ props }: SnippetProps)}
                  <button
                    {...props}
                    class="w-4 h-4 flex items-center justify-center hover:bg-accent rounded transition-colors {!canCollapse && isExpanded ? 'opacity-50 cursor-not-allowed' : ''}"
                    onclick={() => toggleExpand(pin.key)}
                  >
                    {#if isExpanded}
                      <IconChevronDown class="w-3 h-3 text-muted-foreground" />
                    {:else}
                      <IconChevronRight class="w-3 h-3 text-muted-foreground" />
                    {/if}
                  </button>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{isExpanded ? (canCollapse ? '收起' : '有连接，无法收起') : '展开'}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          {:else}
            <span class="w-4"></span>
          {/if}
          
          <!-- 字段名 -->
          {#if pin.description}
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#snippet child({ props }: SnippetProps)}
                  <span {...props} class="text-[11px] text-foreground cursor-help border-b border-dashed border-muted-foreground">{getDisplayKey(pin)}</span>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{pin.description}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          {:else}
            <span class="text-[11px] text-foreground">{getDisplayKey(pin)}</span>
          {/if}
          
          <span class="text-[10px] text-muted-foreground">:</span>
          
          <!-- 类型显示 -->
          {#if pin.expandable && !isExpanded}
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#snippet child({ props }: SnippetProps)}
                  <button
                    {...props}
                    class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 dark:bg-chart-4/30"
                    onclick={() => toggleExpand(pin.key)}
                  >
                    <IconChevronRight class="w-3 h-3" />
                    object
                  </button>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>点击展开字段</p>
              </Tooltip.Content>
            </Tooltip.Root>
          {:else}
            <span class="text-[10px] {getTypeColor(pin.type)}">{pin.type}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- 输出 Handles（绝对定位） -->
  {#each outputPins as pin, i}
    <Handle
      id="output-{pin.key}"
      type="source"
      position={Position.Right}
      style="top: {getHandleTop(i)}px; right: 0px; width: {HANDLE_SIZE}px; height: {HANDLE_SIZE}px; background: {getHandleColor(pin.type)}; border: none;"
      {isConnectable}
    />
  {/each}
</div>
