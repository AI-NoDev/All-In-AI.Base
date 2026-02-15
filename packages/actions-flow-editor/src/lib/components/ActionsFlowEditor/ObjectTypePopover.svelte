<script lang="ts">
  import IconChevronRight from '@iconify-svelte/tdesign/chevron-right';
  import * as Popover from '@qiyu-allinai/ui/components/popover/index.js';
  import * as Tooltip from '@qiyu-allinai/ui/components/tooltip/index.js';
  import type { SchemaProperty } from '../../typeEngine.js';
  import { getDisplayType, getArrayItemSchema, isArrayType, isObjectType, parseArrayType, parseTypeUnion } from '../../typeEngine.js';
  import { getTypeColor } from '../../edgeTypeRule.js';
  import Self from './ObjectTypePopover.svelte';

  interface Props {
    /** JSON Schema 属性（包含 properties） */
    schema: SchemaProperty;
    /** 显示的类型名称 */
    typeName?: string;
    /** 嵌套深度（用于限制递归） */
    depth?: number;
    /** 是否显示必填标记（默认 true） */
    showRequired?: boolean;
  }

  /** Tooltip/Popover child snippet props type */
  type SnippetProps = { props: Record<string, unknown> };

  let { schema, typeName, depth = 0, showRequired = true }: Props = $props();

  // 计算显示类型
  let displayType = $derived(typeName ?? getDisplayType(schema));

  // 解析联合类型为数组
  let typeUnionParts = $derived(parseTypeUnion(displayType));

  // 最大递归深度
  const MAX_DEPTH = 5;

  // 获取数组项 Schema
  let arrayItemSchema = $derived(getArrayItemSchema(schema));

  // 获取 object 的 properties（支持 anyOf/oneOf）
  function getObjectProperties(prop: SchemaProperty): Record<string, SchemaProperty> | null {
    if (prop.properties) {
      return prop.properties as Record<string, SchemaProperty>;
    }
    const unionTypes = (prop.anyOf ?? prop.oneOf) as SchemaProperty[] | undefined;
    if (unionTypes) {
      for (const item of unionTypes) {
        if (item.type === 'object' && item.properties) {
          return item.properties as Record<string, SchemaProperty>;
        }
      }
    }
    return null;
  }

  // 检查类型是否包含 array<object>（需要用 Self 渲染）
  function typeContainsArrayObject(typeStr: string): boolean {
    const parts = parseTypeUnion(typeStr);
    for (const part of parts) {
      if (isArrayType(part)) {
        const innerType = parseArrayType(part);
        if (innerType === 'object') return true;
      }
    }
    return false;
  }

  // 检查单个类型部分是否为 array<object>
  function isPartArrayOfObject(part: string): boolean {
    if (!isArrayType(part)) return false;
    const innerType = parseArrayType(part);
    return innerType === 'object';
  }

  // 检查 array<object> 是否可展开（有 properties）
  function canArrayObjectExpand(itemSchema: SchemaProperty | null): boolean {
    if (!itemSchema || depth >= MAX_DEPTH) return false;
    const itemProps = getObjectProperties(itemSchema);
    return !!(itemProps && Object.keys(itemProps).length > 0);
  }

</script>

<!-- array<object> tag snippet -->
{#snippet renderArrayObjectTag(expandable: boolean, itemSchema: SchemaProperty | null)}
  <span class="text-chart-3 dark:text-chart-3 text-[10px]">array&lt;</span>
  {#if expandable && itemSchema}
    {@const itemProps = getObjectProperties(itemSchema)}
    {@const itemRequired = (itemSchema.required ?? []) as string[]}
    <Popover.Root>
      <Popover.Trigger>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props }: SnippetProps)}
              <button
                {...props}
                class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 dark:bg-chart-4/30 dark:text-chart-4"
              >
                <IconChevronRight class="w-3 h-3" />
                object
              </button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>点击展开数组项字段</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Popover.Trigger>
      <Popover.Content class="w-auto min-w-[180px] max-w-[300px] p-2 text-[11px]" side="right" sideOffset={8}>
        <div class="max-h-[220px] overflow-y-auto">
          <div class="text-muted-foreground text-[10px] mb-1 pb-1 border-b border-border">
            数组项字段:
          </div>
          {#if itemProps}
            {#each Object.entries(itemProps) as [key, prop]}
              {@const propType = getDisplayType(prop)}
              {@const isReq = showRequired && Array.isArray(itemRequired) && itemRequired.includes(key)}
              <div class="flex items-start gap-1 py-1 border-b border-border last:border-b-0">
                {#if showRequired}
                  <span class="text-destructive shrink-0">{isReq ? '*' : ''}</span>
                {/if}
                <span class="text-foreground shrink-0 font-medium">{key}</span>
                <span class="text-muted-foreground shrink-0">:</span>
                {#if typeContainsArrayObject(propType)}
                  <Self schema={prop} typeName={propType} depth={depth + 1} {showRequired} />
                {:else}
                  <span class="{getTypeColor(propType)}">{propType}</span>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </Popover.Content>
    </Popover.Root>
  {:else}
    <!-- 不可展开的 object tag -->
    <span class="px-1 py-0.5 rounded text-[10px] font-medium bg-chart-4/20 text-chart-4 dark:bg-chart-4/30">object</span>
  {/if}
  <span class="text-chart-3 dark:text-chart-3 text-[10px]">&gt;</span>
{/snippet}

<!-- 渲染单个类型部分的 snippet -->
{#snippet renderTypePart(part: string, index: number)}
  {#if index > 0}
    <span class="text-muted-foreground text-[10px]">|</span>
  {/if}
  
  {#if isPartArrayOfObject(part)}
    <!-- array<object> 格式 - 使用 popover -->
    {@render renderArrayObjectTag(canArrayObjectExpand(arrayItemSchema), arrayItemSchema)}
  {:else if isObjectType(part)}
    <!-- object 类型 - 显示为 tag 样式（不可点击，因为 inline 展开在 ActionNode 中处理） -->
    <span class="px-1 py-0.5 rounded text-[10px] font-medium bg-chart-4/20 text-chart-4 dark:bg-chart-4/30">object</span>
  {:else if isArrayType(part)}
    <!-- 其他 array 类型（非 object 子类型） -->
    <span class="text-chart-3 dark:text-chart-3 text-[10px]">{part}</span>
  {:else}
    <!-- 其他基础类型 -->
    <span class="{getTypeColor(part)} text-[10px]">{part}</span>
  {/if}
{/snippet}

<span class="inline-flex items-center flex-wrap gap-0.5">
  {#each typeUnionParts as part, index}
    {@render renderTypePart(part, index)}
  {/each}
</span>
