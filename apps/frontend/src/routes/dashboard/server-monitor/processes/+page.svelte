<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { DataTable } from '$lib/components/common';
  import { toast } from 'svelte-sonner';
  import { getContext } from 'svelte';
  import * as Alert from '$lib/components/ui/alert';
  import { t } from '@/lib/stores/i18n.svelte';

  const monitorData = getContext('monitor-data');
  const API_BASE = monitorData.API_BASE;

  interface ProcessInfo {
    pid: number;
    name: string;
    cpu: number;
    memory: number;
    memoryBytes: number;
    user: string;
    status: string;
  }

  let processes = $state<ProcessInfo[]>([]);
  let processSortBy = $state<'cpu' | 'memory'>('cpu');
  let unavailableMessage = $state<string | null>(null);

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getStatusColor(percent: number): string {
    if (percent >= 90) return 'text-red-500';
    if (percent >= 70) return 'text-yellow-500';
    return 'text-green-500';
  }

  async function loadProcesses() {
    try {
      const res = await fetch(`${API_BASE}/api/monitor/processes?sortBy=${processSortBy}&limit=30`);
      const data = await res.json();
      if (data && typeof data === 'object' && 'unavailable' in data) {
        unavailableMessage = data.unavailable;
        processes = [];
      } else {
        unavailableMessage = null;
        processes = Array.isArray(data) ? data : [];
      }
    } catch (e) {
      console.error('Failed to load processes:', e);
    }
  }

  async function killProcessById(pid: number) {
    if (!confirm(t('page.monitor.killProcessConfirm').replace('${pid}', String(pid)))) return;
    try {
      const res = await fetch(`${API_BASE}/api/monitor/processes/${pid}/kill`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(t('page.monitor.processKilled'));
        await loadProcesses();
      } else {
        toast.error(t('page.monitor.processKillFailed'));
      }
    } catch (e) {
      toast.error(t('page.monitor.processKillFailed'));
    }
  }

  $effect(() => {
    if (processSortBy) loadProcesses();
  });

  onMount(() => {
    loadProcesses();
    const interval = setInterval(loadProcesses, 5000);
    return () => clearInterval(interval);
  });

  const sortOptions = [
    { value: 'cpu', label: t('page.monitor.sortByCpu') },
    { value: 'memory', label: t('page.monitor.sortByMemory') }
  ];

  const columns = [
    { key: 'pid', title: t('page.monitor.pid'), width: 80, render: pidRender },
    { key: 'name', title: t('page.monitor.processName'), width: 200, render: nameRender },
    { key: 'cpu', title: 'CPU %', width: 96, align: 'right' as const, render: cpuRender },
    { key: 'memory', title: t('page.monitor.memory') + ' %', width: 96, align: 'right' as const, render: memoryRender },
    { key: 'memoryBytes', title: t('page.monitor.memory'), width: 112, align: 'right' as const, render: memoryBytesRender },
    { key: 'pid', title: t('page.monitor.actions'), width: 80, fixed: 'right' as const, render: actionsRender },
  ];
</script>

{#snippet pidRender({ value })}
  <span class="font-mono text-xs">{value}</span>
{/snippet}

{#snippet nameRender({ value })}
  <span class="truncate max-w-[200px] block" title={String(value)}>{value}</span>
{/snippet}

{#snippet cpuRender({ row })}
  <span class={getStatusColor(row.cpu)}>{row.cpu.toFixed(1)}</span>
{/snippet}

{#snippet memoryRender({ row })}
  <span class={getStatusColor(row.memory)}>{row.memory.toFixed(1)}</span>
{/snippet}

{#snippet memoryBytesRender({ value })}
  <span class="text-muted-foreground">{formatBytes(Number(value))}</span>
{/snippet}

{#snippet actionsRender({ row })}
  <Button size="sm" variant="ghost" class="h-7 w-7 p-0 text-red-500 hover:text-red-600" onclick={() => killProcessById(row.pid)}>
    <Icon icon="tdesign:close" class="size-4" />
  </Button>
{/snippet}

{#if unavailableMessage}
  <Alert.Root variant="default" class="mb-4">
    <Icon icon="tdesign:info-circle" class="size-4" />
    <Alert.Title>{t('page.monitor.featureUnavailable')}</Alert.Title>
    <Alert.Description>{unavailableMessage}</Alert.Description>
  </Alert.Root>
{:else}
  <div class="flex justify-between items-center mb-4">
    <p class="text-sm text-muted-foreground">{t('page.monitor.totalProcesses').replace('${count}', String(processes.length))}</p>
    <Select.Root type="single" bind:value={processSortBy}>
      <Select.Trigger class="w-32">
        {sortOptions.find(o => o.value === processSortBy)?.label}
      </Select.Trigger>
      <Select.Content>
        {#each sortOptions as option}
          <Select.Item value={option.value}>{option.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
{/if}

<DataTable {columns} data={processes} rowKey="pid" class="h-[500px]" />
