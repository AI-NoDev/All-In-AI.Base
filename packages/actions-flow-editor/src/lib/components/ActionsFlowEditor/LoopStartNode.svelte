<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import IconChevronRight from '@iconify-svelte/tdesign/chevron-right';
  import IconChevronDown from '@iconify-svelte/tdesign/chevron-down';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { LoopStartNodeData, EdgesGetter } from '../../types.js';
  import { EDGES_CONTEXT_KEY } from '../../types.js';
  import { getHandleColor, getTypeColor } from '../../edgeTypeRule.js';
  import { getDisplayType, isObjectType, type SchemaProperty } from '../../typeEngine.js';
  import ObjectTypePopover from './ObjectTypePopover.svelte';

  interface Props {
    id: string;
    data: LoopStartNodeData;
    isConnectable?: boolean;
  }

  interface PinInfo {
    key: string;
    type: string;
    schema?: SchemaProperty;
    depth: number;
    expandable: boolean;
    parentPath?: string;
    description?: string;
  }

  let { id, data, isConnectable = true }: Props = $props();

  // 展开状态
  let expandedPaths = $state<Set<string>>(new Set());

  // 从 context 获取 edges getter 函数
  const getEdges = getContext<EdgesGetter>(EDGES_CONTEXT_KEY);
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

  function handleDelete() {
    if (confirm('确定要删除循环开始节点吗？')) {
      data.onDelete?.(id);
    }
  }

  // 切换展开/收起
  function toggleExpand(path: string) {
    if (expandedPaths.has(path)) {
      if (hasConnectionInSubtree(path)) return;
      const newSet = new Set(expandedPaths);
      for (const p of newSet) {
        if (p === path || p.startsWith(path + '.')) {
          newSet.delete(p);
        }
      }
      expandedPaths = newSet;
    } else {
      const newSet = new Set(expandedPaths);
      newSet.add(path);
      expandedPaths = newSet;
    }
  }

  // 检查是否为空对象
  function isEmptyObject(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).length === 0;
  }

  // 获取 object 的 properties
  function getObjectProperties(schema: SchemaProperty): Record<string, SchemaProperty> | null {
    if (schema.properties) {
      return schema.properties as Record<string, SchemaProperty>;
    }
    const unionTypes = (schema.anyOf ?? schema.oneOf) as SchemaProperty[] | undefined;
    if (unionTypes) {
      for (const item of unionTypes) {
        if (item.type === 'object' && item.properties) {
          return item.properties as Record<string, SchemaProperty>;
        }
      }
    }
    return null;
  }

  // 检查类型是否为可展开的 object
  function isExpandableObject(schema: SchemaProperty, typeStr: string): boolean {
    if (!isObjectType(typeStr)) {
      const parts = typeStr.split('|');
      const hasObject = parts.some(p => isObjectType(p));
      if (!hasObject) return false;
    }
    const props = getObjectProperties(schema);
    return !!(props && Object.keys(props).length > 0);
  }

  // 从 Schema 中安全获取 description
  function getDescription(schema: SchemaProperty): string | undefined {
    if (typeof schema.description === 'string') return schema.description;
    const unionTypes = schema.anyOf ?? schema.oneOf;
    if (Array.isArray(unionTypes)) {
      for (const item of unionTypes) {
        if (typeof item.description === 'string') return item.description;
      }
    }
    return undefined;
  }

  // 递归生成子引脚
  function generateChildPins(schema: SchemaProperty, basePath: string, depth: number): PinInfo[] {
    const childProps = getObjectProperties(schema);
    if (!childProps) return [];
    
    const pins: PinInfo[] = [];
    for (const [key, prop] of Object.entries(childProps)) {
      if (isEmptyObject(prop as Record<string, unknown>)) continue;
      const fullPath = `${basePath}.${key}`;
      const type = getDisplayType(prop);
      const expandable = isExpandableObject(prop, type);
      
      pins.push({
        key: fullPath,
        type,
        schema: prop,
        depth,
        expandable,
        parentPath: basePath,
        description: getDescription(prop),
      });
      
      if (expandable && expandedPaths.has(fullPath)) {
        pins.push(...generateChildPins(prop, fullPath, depth + 1));
      }
    }
    return pins;
  }

  // 生成 item 引脚列表
  let itemPins = $derived.by(() => {
    const pins: PinInfo[] = [];
    const itemType = data.outputType;
    const itemSchema = data.itemSchema as SchemaProperty | undefined;
    
    // 主 item 引脚
    const expandable = itemSchema ? isExpandableObject(itemSchema, itemType) : false;
    pins.push({
      key: 'item',
      type: itemType,
      schema: itemSchema,
      depth: 0,
      expandable,
      description: itemSchema ? getDescription(itemSchema) : undefined,
    });
    
    // 如果已展开且是 object 类型，添加子字段
    if (expandable && expandedPaths.has('item') && itemSchema) {
      pins.push(...generateChildPins(itemSchema, 'item', 1));
    }
    
    return pins;
  });

  // 所有输出引脚（item 引脚 + index）
  let allPins = $derived([...itemPins, { key: 'index', type: 'number', depth: 0, expandable: false }]);

  // 布局常量
  const HEADER_HEIGHT = 36;
  const ROW_HEIGHT = 24;
  const PINS_PADDING_Y = 8;
  const HANDLE_SIZE = 10;

  function getHandleTop(index: number): number {
    return HEADER_HEIGHT + PINS_PADDING_Y + index * ROW_HEIGHT + ROW_HEIGHT / 2;
  }

  function getDisplayKey(pin: PinInfo): string {
    const parts = pin.key.split('.');
    return parts[parts.length - 1];
  }
</script>

<div class="min-w-[160px] rounded-lg shadow-md text-primary-foreground relative group bg-primary" style="box-shadow: 0 2px 4px hsl(var(--primary) / 0.3);">
  <!-- 删除按钮 -->
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          class="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
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

  <!-- 节点头部 -->
  <div class="flex items-center gap-2 px-3.5 font-semibold" style="height: {HEADER_HEIGHT}px;">
    <span class="text-sm">↻</span>
    <span class="text-sm">循环项</span>
  </div>

  <!-- 引脚区域 -->
  <div class="bg-card/10 rounded-b-lg" style="padding: {PINS_PADDING_Y}px 0;">
    {#each allPins as pin, i}
      {@const isExpanded = expandedPaths.has(pin.key)}
      {@const canCollapse = !hasConnectionInSubtree(pin.key)}
      <div 
        class="flex items-center justify-end gap-1 px-3.5" 
        style="height: {ROW_HEIGHT}px; padding-right: {12 + pin.depth * 12}px;"
      >
        {#if pin.description}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <span {...props} class="text-[11px] opacity-90 cursor-help border-b border-dashed border-white/50">{getDisplayKey(pin)}</span>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{pin.description}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {:else}
          <span class="text-[11px] opacity-90">{getDisplayKey(pin)}</span>
        {/if}
        <span class="text-[10px] opacity-70">:</span>
        
        {#if pin.expandable && !isExpanded}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <button
                  {...props}
                  class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer bg-card/20 text-chart-4 hover:bg-card/30"
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
          <span class="text-[11px] {getTypeColor(pin.type)} bg-card/20 px-1 rounded">{pin.type}</span>
        {/if}
        
        {#if pin.expandable}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <button
                  {...props}
                  class="w-4 h-4 flex items-center justify-center hover:bg-card/20 rounded transition-colors {!canCollapse && isExpanded ? 'opacity-50 cursor-not-allowed' : ''}"
                  onclick={() => toggleExpand(pin.key)}
                >
                  {#if isExpanded}
                    <IconChevronDown class="w-3 h-3" />
                  {:else}
                    <IconChevronRight class="w-3 h-3" />
                  {/if}
                </button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{isExpanded ? (canCollapse ? '收起' : '有连接，无法收起') : '展开'}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </div>
    {/each}
  </div>

  <!-- 输出 Handles -->
  {#each allPins as pin, i}
    <Handle
      id="output-{pin.key}"
      type="source"
      position={Position.Right}
      style="top: {getHandleTop(i)}px; right: 0px; width: {HANDLE_SIZE}px; height: {HANDLE_SIZE}px; background: {getHandleColor(pin.type)}; border: none;"
      {isConnectable}
    />
  {/each}
</div>
