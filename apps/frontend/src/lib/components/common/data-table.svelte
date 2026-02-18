<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from 'svelte';
  import * as Table from '$lib/components/ui/table';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ScrollArea } from '$lib/components/ui/scroll-area';

  interface Column<T> {
    key: keyof T | string;
    title: string;
    width?: number;
    minWidth?: number;
    align?: 'left' | 'center' | 'right';
    render?: Snippet<[{ row: T; value: unknown; index: number }]>;
  }

  interface Props {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    rowKey?: keyof T;
    onRowClick?: (row: T, index: number) => void;
    class?: string;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    disableSelect?: (row: T) => boolean;
  }

  let {
    columns,
    data,
    loading = false,
    emptyText = '暂无数据',
    rowKey = 'id' as keyof T,
    onRowClick,
    class: className = '',
    selectable = false,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    disableSelect,
  }: Props = $props();

  let selectableRows = $derived(disableSelect ? data.filter(row => !disableSelect(row)) : data);
  let allSelected = $derived(selectableRows.length > 0 && selectableRows.every(row => selectedIds.has(String(row[rowKey]))));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function getValue(row: T, key: keyof T | string): unknown {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], row);
    }
    return row[key as keyof T];
  }

  function getAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  }

  function getRowId(row: T): string {
    return String(row[rowKey]);
  }

  function getColStyle(col: Column<T>): string {
    const styles: string[] = [];
    if (col.width) styles.push(`width: ${col.width}px`);
    if (col.minWidth) styles.push(`min-width: ${col.minWidth}px`);
    return styles.join('; ');
  }
</script>

<div class="flex flex-col flex-1 min-h-0 rounded-md border {className}">
  {#if loading}
    <div class="space-y-3 p-4">
      {#each [1, 2, 3, 4, 5] as _}
        <Skeleton class="h-12 w-full" />
      {/each}
    </div>
  {:else}
    <ScrollArea class="flex-1 min-h-0">
      <Table.Root>
        <Table.Header class="sticky top-0 bg-muted/50 z-10">
          <Table.Row>
            {#if selectable}
              <Table.Head class="w-12">
                <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={onToggleSelectAll} />
              </Table.Head>
            {/if}
            {#each columns as col}
              <Table.Head class={getAlignClass(col.align)} style={getColStyle(col)}>
                {col.title}
              </Table.Head>
            {/each}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data as row, index (row[rowKey] ?? index)}
            {@const rowId = getRowId(row)}
            {@const isDisabled = disableSelect?.(row) ?? false}
            {@const isSelected = selectedIds.has(rowId)}
            <Table.Row 
              class="{onRowClick ? 'cursor-pointer' : ''} {isSelected ? 'bg-muted/50' : ''}"
              onclick={() => onRowClick?.(row, index)}
            >
              {#if selectable}
                <Table.Cell class="w-12" onclick={(e: MouseEvent) => e.stopPropagation()}>
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={() => onToggleSelect?.(rowId)}
                    disabled={isDisabled}
                  />
                </Table.Cell>
              {/if}
              {#each columns as col}
                <Table.Cell class={getAlignClass(col.align)} style={getColStyle(col)}>
                  {#if col.render}
                    {@render col.render({ row, value: getValue(row, col.key), index })}
                  {:else}
                    {getValue(row, col.key) ?? '-'}
                  {/if}
                </Table.Cell>
              {/each}
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell colspan={columns.length + (selectable ? 1 : 0)} class="h-24 text-center text-muted-foreground">
                {emptyText}
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  {/if}
</div>
