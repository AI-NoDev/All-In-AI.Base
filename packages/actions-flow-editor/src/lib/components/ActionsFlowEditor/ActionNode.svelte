<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import IconChevronRight from '@iconify-svelte/tdesign/chevron-right';
  import IconChevronDown from '@iconify-svelte/tdesign/chevron-down';
  import IconPlay from '@iconify-svelte/tdesign/play';
  import IconLoading from '@iconify-svelte/tdesign/loading';
  import IconCheck from '@iconify-svelte/tdesign/check';
  import IconClose from '@iconify-svelte/tdesign/close';
  import IconBrowse from '@iconify-svelte/tdesign/browse';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { ActionNodeData, EdgesGetter, DebugStateGetter, OpenDebugDialogFn } from '../../types.js';
  import { EDGES_CONTEXT_KEY, DEBUG_STATE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY } from '../../types.js';
  import { getDisplayType, isArrayType, isObjectType, parseArrayType, type SchemaProperty } from '../../typeEngine.js';
  import { getHandleColor, getTypeColor } from '../../edgeTypeRule.js';
  import ObjectTypePopover from './ObjectTypePopover.svelte';

  interface Props {
    id: string;
    data: ActionNodeData;
    isConnectable?: boolean;
  }

  interface PinInfo {
    /** 显示的键名（可能包含点号，如 result.id） */
    key: string;
    /** 类型字符串 */
    type: string;
    /** 是否必填 */
    required: boolean;
    /** 原始 Schema（用于 object 类型展开） */
    schema?: SchemaProperty;
    /** 嵌套深度（用于缩进） */
    depth: number;
    /** 是否可展开（object 类型且有 properties） */
    expandable: boolean;
    /** 父路径（用于展开/收起） */
    parentPath?: string;
    /** 字段描述 */
    description?: string;
  }

  let { id, data, isConnectable = true }: Props = $props();

  // 展开状态：存储已展开的路径（如 'result', 'result.user'）
  let expandedInputPaths = $state<Set<string>>(new Set());
  let expandedOutputPaths = $state<Set<string>>(new Set());

  // 从 context 获取 edges getter 函数
  const getEdges = getContext<EdgesGetter>(EDGES_CONTEXT_KEY);
  
  // 从 context 获取调试状态和打开对话框函数
  const getDebugState = getContext<DebugStateGetter | undefined>(DEBUG_STATE_CONTEXT_KEY);
  const openDebugDialog = getContext<OpenDebugDialogFn | undefined>(OPEN_DEBUG_DIALOG_CONTEXT_KEY);
  
  // 响应式获取 edges
  let edges = $derived(getEdges?.() ?? []);
  
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
      nodeName: data.action.name,
      nodeType: 'action',
      initialInput: {},
      inputSchema: data.action.inputSchema,
    });
  }

  // 计算当前节点所有有连接的输入引脚路径
  let connectedInputPaths = $derived.by(() => {
    const paths = new Set<string>();
    for (const e of edges) {
      if (e.target === id && e.targetHandle) {
        const pinKey = e.targetHandle.replace('input-', '');
        paths.add(pinKey);
      }
    }
    return paths;
  });

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
  function hasConnectionInSubtree(basePath: string, isOutput: boolean): boolean {
    const connectedPaths = isOutput ? connectedOutputPaths : connectedInputPaths;
    const prefix = basePath + '.';
    for (const path of connectedPaths) {
      if (path === basePath || path.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  // 删除确认
  function handleDelete() {
    if (confirm('确定要删除此节点吗？')) {
      data.onDelete?.(id);
    }
  }

  // 切换展开/收起
  function toggleExpand(path: string, isOutput: boolean) {
    const expandedPaths = isOutput ? expandedOutputPaths : expandedInputPaths;
    const setExpandedPaths = isOutput 
      ? (v: Set<string>) => { expandedOutputPaths = v; }
      : (v: Set<string>) => { expandedInputPaths = v; };
    
    if (expandedPaths.has(path)) {
      // 尝试收起 - 检查是否有子路径有连接
      if (hasConnectionInSubtree(path, isOutput)) {
        // 有连接，不允许收起
        return;
      }
      const newSet = new Set(expandedPaths);
      // 收起时也要收起所有子路径
      for (const p of newSet) {
        if (p === path || p.startsWith(path + '.')) {
          newSet.delete(p);
        }
      }
      setExpandedPaths(newSet);
    } else {
      // 展开
      const newSet = new Set(expandedPaths);
      newSet.add(path);
      setExpandedPaths(newSet);
    }
  }

  // 检查是否为空对象
  function isEmptyObject(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).length === 0;
  }

  // 获取 object 的 properties（支持 anyOf/oneOf）
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

  // 获取 required 字段列表
  function getRequired(schema: SchemaProperty): string[] {
    if (schema.required && Array.isArray(schema.required)) {
      return schema.required as string[];
    }
    const unionTypes = (schema.anyOf ?? schema.oneOf) as SchemaProperty[] | undefined;
    if (unionTypes) {
      for (const item of unionTypes) {
        if (item.type === 'object' && item.required) {
          return item.required as string[];
        }
      }
    }
    return [];
  }

  // 检查类型是否为可展开的 object（有 properties）
  function isExpandableObject(schema: SchemaProperty, typeStr: string): boolean {
    // 只有纯 object 类型才能展开，array<object> 不能展开
    if (!isObjectType(typeStr)) {
      // 检查联合类型中是否有 object
      const parts = typeStr.split('|');
      const hasObject = parts.some(p => isObjectType(p));
      if (!hasObject) return false;
    }
    
    const props = getObjectProperties(schema);
    return !!(props && Object.keys(props).length > 0);
  }

  // 检查类型是否包含 array<object>（用于显示 popover）
  function containsArrayObject(typeStr: string): boolean {
    const parts = typeStr.split('|');
    for (const part of parts) {
      if (isArrayType(part)) {
        const innerType = parseArrayType(part);
        if (innerType === 'object') return true;
      }
    }
    return false;
  }

  // 从 Schema 中安全获取 description（支持 anyOf/oneOf 结构）
  function getDescription(schema: SchemaProperty): string | undefined {
    // 直接有 description
    if (typeof schema.description === 'string') {
      return schema.description;
    }
    // 从 anyOf/oneOf 中查找 description
    const unionTypes = schema.anyOf ?? schema.oneOf;
    if (Array.isArray(unionTypes)) {
      for (const item of unionTypes) {
        if (typeof item.description === 'string') {
          return item.description;
        }
      }
    }
    return undefined;
  }

  // 递归生成引脚信息
  function generatePins(
    schema: Record<string, unknown> | undefined,
    isOutput: boolean,
    basePath: string = '',
    depth: number = 0
  ): PinInfo[] {
    if (!schema) return [];
    
    const expandedPaths = isOutput ? expandedOutputPaths : expandedInputPaths;
    let properties: Record<string, SchemaProperty> | undefined;
    let required: string[] = [];
    
    // 直接有 properties（明确的 object 类型）
    if (schema.properties) {
      properties = schema.properties as Record<string, SchemaProperty>;
      required = (schema.required as string[]) ?? [];
    }
    
    // 处理 nullable object: anyOf/oneOf 结构
    if (!properties && !schema.type) {
      const anyOf = (schema.anyOf ?? schema.oneOf) as SchemaProperty[] | undefined;
      if (anyOf) {
        const objectItem = anyOf.find(item => item.type === 'object' && item.properties);
        const nullItem = anyOf.find(item => item.type === 'null');
        const otherItems = anyOf.filter(item => item !== objectItem && item !== nullItem);
        
        // 纯粹的 object | null，作为单个 result 输出
        if (objectItem && nullItem && otherItems.length === 0 && anyOf.length === 2) {
          const type = getDisplayType(schema as SchemaProperty);
          const expandable = isExpandableObject(schema as SchemaProperty, type);
          const key = basePath || 'result';
          const pins: PinInfo[] = [{
            key,
            type,
            required: !isOutput, // 顶层输出默认不必填
            schema: schema as SchemaProperty,
            depth,
            expandable,
            description: getDescription(schema as SchemaProperty),
          }];
          
          // 如果已展开，添加子字段
          if (expandable && expandedPaths.has(key)) {
            const childProps = getObjectProperties(schema as SchemaProperty);
            const childRequired = getRequired(schema as SchemaProperty);
            if (childProps) {
              for (const [childKey, childSchema] of Object.entries(childProps)) {
                if (isEmptyObject(childSchema as Record<string, unknown>)) continue;
                const childPath = `${key}.${childKey}`;
                const childType = getDisplayType(childSchema);
                const childExpandable = isExpandableObject(childSchema, childType);
                
                pins.push({
                  key: childPath,
                  type: childType,
                  required: !isOutput && childRequired.includes(childKey),
                  schema: childSchema,
                  depth: depth + 1,
                  expandable: childExpandable,
                  parentPath: key,
                  description: getDescription(childSchema),
                });
                
                // 递归展开
                if (childExpandable && expandedPaths.has(childPath)) {
                  const grandChildPins = generatePins(
                    childSchema as Record<string, unknown>,
                    isOutput,
                    childPath,
                    depth + 2
                  );
                  // 过滤掉第一个（已经添加了）
                  pins.push(...grandChildPins.slice(1));
                }
              }
            }
          }
          
          return pins;
        }
        
        // 其他联合类型情况
        if (anyOf.length > 0) {
          const type = getDisplayType(schema as SchemaProperty);
          const key = basePath || 'result';
          const expandable = isExpandableObject(schema as SchemaProperty, type);
          const pins: PinInfo[] = [{
            key,
            type,
            required: !isOutput,
            schema: schema as SchemaProperty,
            depth,
            expandable,
            description: getDescription(schema as SchemaProperty),
          }];
          
          if (expandable && expandedPaths.has(key)) {
            const childProps = getObjectProperties(schema as SchemaProperty);
            const childRequired = getRequired(schema as SchemaProperty);
            if (childProps) {
              for (const [childKey, childSchema] of Object.entries(childProps)) {
                if (isEmptyObject(childSchema as Record<string, unknown>)) continue;
                const childPath = `${key}.${childKey}`;
                const childType = getDisplayType(childSchema);
                const childExpandable = isExpandableObject(childSchema, childType);
                
                pins.push({
                  key: childPath,
                  type: childType,
                  required: !isOutput && childRequired.includes(childKey),
                  schema: childSchema,
                  depth: depth + 1,
                  expandable: childExpandable,
                  parentPath: key,
                  description: getDescription(childSchema),
                });
                
                if (childExpandable && expandedPaths.has(childPath)) {
                  const grandChildPins = generatePins(
                    childSchema as Record<string, unknown>,
                    isOutput,
                    childPath,
                    depth + 2
                  );
                  pins.push(...grandChildPins.slice(1));
                }
              }
            }
          }
          
          return pins;
        }
      }
    }
    
    // 处理简单类型（如 z.boolean(), z.array()）
    if (!properties && schema.type && schema.type !== 'object') {
      const type = getDisplayType(schema as SchemaProperty);
      const key = basePath || 'result';
      return [{
        key,
        type,
        required: !isOutput,
        schema: schema as SchemaProperty,
        depth,
        expandable: false,
        description: getDescription(schema as SchemaProperty),
      }];
    }
    
    if (!properties) return [];
    
    const pins: PinInfo[] = [];
    for (const [key, prop] of Object.entries(properties)) {
      if (isEmptyObject(prop as Record<string, unknown>)) continue;
      
      const fullPath = basePath ? `${basePath}.${key}` : key;
      const type = getDisplayType(prop);
      const expandable = isExpandableObject(prop, type);
      
      pins.push({
        key: fullPath,
        type,
        required: !isOutput && required.includes(key),
        schema: prop,
        depth,
        expandable,
        parentPath: basePath || undefined,
        description: getDescription(prop),
      });
      
      // 如果已展开，递归添加子字段
      if (expandable && expandedPaths.has(fullPath)) {
        const childProps = getObjectProperties(prop);
        const childRequired = getRequired(prop);
        if (childProps) {
          for (const [childKey, childSchema] of Object.entries(childProps)) {
            if (isEmptyObject(childSchema as Record<string, unknown>)) continue;
            const childPath = `${fullPath}.${childKey}`;
            const childType = getDisplayType(childSchema);
            const childExpandable = isExpandableObject(childSchema, childType);
            
            pins.push({
              key: childPath,
              type: childType,
              required: !isOutput && childRequired.includes(childKey),
              schema: childSchema,
              depth: depth + 1,
              expandable: childExpandable,
              parentPath: fullPath,
              description: getDescription(childSchema),
            });
            
            // 递归展开
            if (childExpandable && expandedPaths.has(childPath)) {
              const grandChildPins = generateChildPins(
                childSchema,
                isOutput,
                childPath,
                depth + 2
              );
              pins.push(...grandChildPins);
            }
          }
        }
      }
    }
    
    return pins;
  }

  // 递归生成子引脚（辅助函数）
  function generateChildPins(
    schema: SchemaProperty,
    isOutput: boolean,
    basePath: string,
    depth: number
  ): PinInfo[] {
    const expandedPaths = isOutput ? expandedOutputPaths : expandedInputPaths;
    const childProps = getObjectProperties(schema);
    const childRequired = getRequired(schema);
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
        required: !isOutput && childRequired.includes(key),
        schema: prop,
        depth,
        expandable,
        parentPath: basePath,
        description: getDescription(prop),
      });
      
      if (expandable && expandedPaths.has(fullPath)) {
        const grandChildPins = generateChildPins(prop, isOutput, fullPath, depth + 1);
        pins.push(...grandChildPins);
      }
    }
    
    return pins;
  }

  // 合并所有输入 Schema 的引脚信息
  let inputPins = $derived.by(() => {
    const pins: PinInfo[] = [];
    const seen = new Set<string>();
    const { query, params, body } = data.action.inputSchema;
    
    for (const schema of [query, params, body]) {
      for (const pin of generatePins(schema, false)) {
        if (!seen.has(pin.key)) {
          seen.add(pin.key);
          pins.push(pin);
        }
      }
    }
    return pins;
  });

  // 输出 Schema 的引脚信息
  let outputPins = $derived.by(() => {
    return generatePins(data.action.outputSchema, true);
  });

  // 计算最大引脚数量
  let maxPins = $derived(Math.max(inputPins.length, outputPins.length, 1));

  // 方法对应的颜色类
  const methodColors: Record<string, string> = {
    get: 'bg-primary/20 text-primary dark:bg-primary/30',
    post: 'bg-chart-2/20 text-chart-2 dark:bg-chart-2/30',
    put: 'bg-chart-4/20 text-chart-4 dark:bg-chart-4/30',
    delete: 'bg-destructive/20 text-destructive dark:bg-destructive/30',
  };

  // 布局常量
  const HEADER_HEIGHT = 36;
  const ROW_HEIGHT = 24;
  const PINS_PADDING_Y = 8;

  // 计算 Handle 的 top 位置（相对于节点）
  function getHandleTop(index: number): number {
    return HEADER_HEIGHT + PINS_PADDING_Y + index * ROW_HEIGHT + ROW_HEIGHT / 2;
  }

  // 获取显示的键名（只显示最后一部分，带缩进）
  function getDisplayKey(pin: PinInfo): string {
    const parts = pin.key.split('.');
    return parts[parts.length - 1];
  }

  // 渲染类型显示（处理 array<object> 的 popover）
  function shouldShowPopover(pin: PinInfo): boolean {
    return containsArrayObject(pin.type) && !!pin.schema;
  }
</script>

<div class="min-w-[220px] bg-card border border-border rounded-lg shadow-sm text-xs relative group {debugResult?.status === 'success' ? 'ring-2 ring-chart-2' : debugResult?.status === 'error' ? 'ring-2 ring-destructive' : ''}">
  <!-- 操作按钮组 -->
  <div class="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    <!-- 查看结果按钮（运行成功/失败后显示） -->
    {#if hasResult && hasDebug}
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
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
          {#snippet child({ props })}
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
        {#snippet child({ props })}
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
        {#snippet child({ props })}
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
  <div class="flex items-center gap-2 px-3 border-b border-border bg-muted rounded-t-lg" style="height: {HEADER_HEIGHT}px;">
    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 {methodColors[data.action.method.toLowerCase()] ?? 'bg-secondary text-secondary-foreground'}">
      {data.action.method}
    </span>
    <span class="font-medium text-card-foreground truncate">{data.action.displayName}</span>
  </div>

  <!-- 引脚区域 -->
  <div style="padding: {PINS_PADDING_Y}px 0;">
    {#each { length: maxPins } as _, i}
      <div class="flex items-center justify-between px-3 gap-4" style="height: {ROW_HEIGHT}px;">
        <!-- 左侧输入标签 -->
        <span class="text-[11px] truncate relative flex items-center gap-0.5" style="padding-left: {(inputPins[i]?.depth ?? 0) * 12}px;">
          {#if inputPins[i]}
            {@const pin = inputPins[i]}
            {@const isExpanded = expandedInputPaths.has(pin.key)}
            {@const canCollapse = !hasConnectionInSubtree(pin.key, false)}
            
            <!-- 展开/收起按钮 -->
            {#if pin.expandable}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <button
                      {...props}
                      class="w-4 h-4 flex items-center justify-center hover:bg-accent rounded transition-colors {!canCollapse && isExpanded ? 'opacity-50 cursor-not-allowed' : ''}"
                      onclick={() => toggleExpand(pin.key, false)}
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
            
            <span class="text-destructive">{pin.required ? '*' : ''}</span>
            {#if pin.description}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <span {...props} class="text-foreground cursor-help border-b border-dashed border-muted-foreground">{getDisplayKey(pin)}</span>
                  {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{pin.description}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            {:else}
              <span class="text-foreground">{getDisplayKey(pin)}</span>
            {/if}
            <span class="text-muted-foreground">:</span>
            
            {#if shouldShowPopover(pin) && pin.schema}
              <ObjectTypePopover schema={pin.schema} typeName={pin.type} />
            {:else if pin.expandable && !isExpanded}
              <!-- 未展开的 object 显示为可点击的 tag -->
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <button
                      {...props}
                      class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 dark:bg-chart-4/30"
                      onclick={() => toggleExpand(pin.key, false)}
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
              <span class="{getTypeColor(pin.type)}">{pin.type}</span>
            {/if}
          {/if}
        </span>
        
        <!-- 右侧输出标签 -->
        <span class="text-[11px] truncate text-right relative flex items-center justify-end gap-0.5" style="padding-right: {(outputPins[i]?.depth ?? 0) * 12}px;">
          {#if outputPins[i]}
            {@const pin = outputPins[i]}
            {@const isExpanded = expandedOutputPaths.has(pin.key)}
            {@const canCollapse = !hasConnectionInSubtree(pin.key, true)}
            
            {#if pin.description}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <span {...props} class="text-foreground cursor-help border-b border-dashed border-muted-foreground">{getDisplayKey(pin)}</span>
                  {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{pin.description}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            {:else}
              <span class="text-foreground">{getDisplayKey(pin)}</span>
            {/if}
            <span class="text-muted-foreground">:</span>
            
            {#if shouldShowPopover(pin) && pin.schema}
              <ObjectTypePopover schema={pin.schema} typeName={pin.type} showRequired={false} />
            {:else if pin.expandable && !isExpanded}
              <!-- 未展开的 object 显示为可点击的 tag -->
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <button
                      {...props}
                      class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 dark:bg-chart-4/30"
                      onclick={() => toggleExpand(pin.key, true)}
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
              <span class="{getTypeColor(pin.type)}">{pin.type}</span>
            {/if}
            
            <!-- 展开/收起按钮 -->
            {#if pin.expandable}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#snippet child({ props })}
                    <button
                      {...props}
                      class="w-4 h-4 flex items-center justify-center hover:bg-accent rounded transition-colors {!canCollapse && isExpanded ? 'opacity-50 cursor-not-allowed' : ''}"
                      onclick={() => toggleExpand(pin.key, true)}
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
          {/if}
        </span>
      </div>
    {/each}
  </div>

  <!-- 节点描述 -->
  {#if data.action.description}
    <div class="px-3 py-2 text-muted-foreground text-[11px] border-t border-border line-clamp-2">
      {data.action.description}
    </div>
  {/if}

  <!-- 输入 Handles（绝对定位，内收到节点边缘） -->
  {#each inputPins as pin, i}
    <Handle
      id="input-{pin.key}"
      type="target"
      position={Position.Left}
      style="top: {getHandleTop(i)}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor(pin.type)}; border: none;"
      {isConnectable}
    />
  {/each}

  <!-- 输出 Handles（绝对定位，内收到节点边缘） -->
  {#each outputPins as pin, i}
    <Handle
      id="output-{pin.key}"
      type="source"
      position={Position.Right}
      style="top: {getHandleTop(i)}px; right: 0px; width: 10px; height: 10px; background: {getHandleColor(pin.type)}; border: none;"
      {isConnectable}
    />
  {/each}
</div>
