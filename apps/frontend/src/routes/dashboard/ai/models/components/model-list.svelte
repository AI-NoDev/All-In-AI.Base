<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { DataTable } from '$lib/components/common';

  interface Model {
    id: string;
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    remark: string | null;
    createdAt: string;
    // 能力支持
    supportTools: boolean;
    supportThinking: boolean;
    supportPrefixCompletion: boolean;
    supportFIM: boolean;
    supportJsonOutput: boolean;
    // 输入能力
    supportImageInput: boolean;
    supportVideoInput: boolean;
    supportAudioInput: boolean;
    // 输出能力
    supportImageOutput: boolean;
    supportVideoOutput: boolean;
    supportAudioOutput: boolean;
    // Token 限制
    contextWindow: number | null;
    maxInputTokens: number | null;
    maxOutputTokens: number | null;
    maxThinkingTokens: number | null;
    // 成本
    inputPricePerMillion: string | null;
    outputPricePerMillion: string | null;
    cacheHitPricePerMillion: string | null;
    cacheMissPricePerMillion: string | null;
  }

  interface Provider {
    id: string;
    name: string;
  }

  interface Props {
    models: Model[];
    providers: Provider[];
    loading: boolean;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onCreate: () => void;
    onEdit: (model: Model) => void;
    onDelete: (id: string) => void;
    onBatchDelete: () => void;
    onRefresh: () => void;
    onTest: (model: Model) => void;
  }

  let { models, providers, loading, selectedIds, onToggleSelect, onToggleSelectAll, onCreate, onEdit, onDelete, onBatchDelete, onRefresh, onTest }: Props = $props();

  function getProviderName(providerId: string): string {
    return providers.find(p => p.id === providerId)?.name || '-';
  }

  function formatTokens(value: number | null): string {
    if (value === null || value === undefined) return '-';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return String(value);
  }

  function formatPrice(value: string | null): string {
    if (value === null || value === undefined) return '-';
    return `¥${value}`;
  }

  const columns = [
    { key: 'name', title: '模型名称', width: 140 },
    { key: 'modelId', title: '模型ID', width: 160, render: modelIdRender },
    { key: 'providerId', title: '提供商', width: 100, render: providerRender },
    { key: 'capabilities', title: '能力', width: 120, render: capabilitiesRender },
    { key: 'io', title: '输入/输出', width: 100, render: ioRender },
    { key: 'contextWindow', title: '上下文', width: 80, render: contextRender },
    { key: 'pricing', title: '价格(入/出)', width: 100, render: pricingRender },
    { key: 'status', title: '状态', width: 70, render: statusRender },
    { key: 'id', title: '操作', width: 120, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ];
</script>

{#snippet modelIdRender({ value })}
  <span class="text-muted-foreground font-mono text-xs">{value}</span>
{/snippet}

{#snippet providerRender({ row })}
  {getProviderName(row.providerId)}
{/snippet}

{#snippet capabilitiesRender({ row })}
  <div class="flex flex-wrap gap-0.5">
    {#if row.supportTools}
      <Badge variant="outline" class="text-[10px] px-1 py-0">工具</Badge>
    {/if}
    {#if row.supportThinking}
      <Badge variant="outline" class="text-[10px] px-1 py-0">思考</Badge>
    {/if}
    {#if row.supportJsonOutput}
      <Badge variant="outline" class="text-[10px] px-1 py-0">JSON</Badge>
    {/if}
    {#if row.supportFIM}
      <Badge variant="outline" class="text-[10px] px-1 py-0">FIM</Badge>
    {/if}
    {#if row.supportPrefixCompletion}
      <Badge variant="outline" class="text-[10px] px-1 py-0">续写</Badge>
    {/if}
    {#if !row.supportTools && !row.supportThinking && !row.supportJsonOutput && !row.supportFIM && !row.supportPrefixCompletion}
      <span class="text-muted-foreground text-xs">-</span>
    {/if}
  </div>
{/snippet}

{#snippet ioRender({ row })}
  <div class="flex gap-2 text-xs">
    <div class="flex items-center gap-0.5" title="输入">
      <span class="text-muted-foreground">入:</span>
      {#if row.supportImageInput}<Icon icon="mdi:image" class="size-3.5" />{/if}
      {#if row.supportVideoInput}<Icon icon="mdi:video" class="size-3.5" />{/if}
      {#if row.supportAudioInput}<Icon icon="mdi:microphone" class="size-3.5" />{/if}
      {#if !row.supportImageInput && !row.supportVideoInput && !row.supportAudioInput}<span class="text-muted-foreground">-</span>{/if}
    </div>
    <div class="flex items-center gap-0.5" title="输出">
      <span class="text-muted-foreground">出:</span>
      {#if row.supportImageOutput}<Icon icon="mdi:image" class="size-3.5" />{/if}
      {#if row.supportVideoOutput}<Icon icon="mdi:video" class="size-3.5" />{/if}
      {#if row.supportAudioOutput}<Icon icon="mdi:microphone" class="size-3.5" />{/if}
      {#if !row.supportImageOutput && !row.supportVideoOutput && !row.supportAudioOutput}<span class="text-muted-foreground">-</span>{/if}
    </div>
  </div>
{/snippet}

{#snippet contextRender({ row })}
  <span class="text-xs">{formatTokens(row.contextWindow)}</span>
{/snippet}

{#snippet pricingRender({ row })}
  <span class="text-xs font-mono">
    {formatPrice(row.inputPricePerMillion)}/{formatPrice(row.outputPricePerMillion)}
  </span>
{/snippet}

{#snippet statusRender({ value })}
  <Badge variant={value === '0' ? 'default' : 'secondary'}>
    {value === '0' ? '正常' : '停用'}
  </Badge>
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-end gap-1">
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onTest(row)} title="测试">
      <Icon icon="mdi:play" class="size-4" />
    </Button>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onEdit(row)} title="编辑">
      <Icon icon="mdi:pencil" class="size-4" />
    </Button>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(row.id)} title="删除">
      <Icon icon="mdi:delete" class="size-4" />
    </Button>
  </div>
{/snippet}

<div class="flex-1 flex flex-col min-h-0 pl-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={onCreate}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增模型
      </Button>
      {#if selectedIds.size > 0}
        <Button size="sm" variant="destructive" onclick={onBatchDelete}>
          <Icon icon="mdi:delete" class="mr-1 size-4" />删除({selectedIds.size})
        </Button>
      {/if}
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>
  <div class="flex-1 min-h-0 pt-4">
    <DataTable 
      {columns} 
      data={models} 
      {loading}
      selectable
      {selectedIds}
      {onToggleSelect}
      {onToggleSelectAll}
    />
  </div>
</div>
