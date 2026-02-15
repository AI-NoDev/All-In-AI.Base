
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { toast } from 'svelte-sonner';
  import { getContext } from 'svelte';

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
      processes = await res.json();
    } catch (e) {
      console.error('Failed to load processes:', e);
    }
  }

  async function killProcessById(pid: number) {
    if (!confirm(`确定要终止进程 ${pid} 吗？`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/monitor/processes/${pid}/kill`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('进程已终止');
        await loadProcesses();
      } else {
        toast.error('终止进程失败');
      }
    } catch (e) {
      toast.error('终止进程失败');
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
    { value: 'cpu', label: '按 CPU' },
    { value: 'memory', label: '按内存' }
  ];
</script>

<div class="flex justify-between items-center mb-4">
  <p class="text-sm text-muted-foreground">共 {processes.length} 个进程</p>
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

<Card.Root>
  <ScrollArea class="h-[500px]">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-20">PID</Table.Head>
          <Table.Head>进程名</Table.Head>
          <Table.Head class="w-24 text-right">CPU %</Table.Head>
          <Table.Head class="w-24 text-right">内存 %</Table.Head>
          <Table.Head class="w-28 text-right">内存</Table.Head>
          <Table.Head class="w-20">操作</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each processes as proc}
          <Table.Row>
            <Table.Cell class="font-mono text-xs">{proc.pid}</Table.Cell>
            <Table.Cell class="truncate max-w-[200px]" title={proc.name}>{proc.name}</Table.Cell>
            <Table.Cell class="text-right {getStatusColor(proc.cpu)}">{proc.cpu.toFixed(1)}</Table.Cell>
            <Table.Cell class="text-right {getStatusColor(proc.memory)}">{proc.memory.toFixed(1)}</Table.Cell>
            <Table.Cell class="text-right text-muted-foreground">{formatBytes(proc.memoryBytes)}</Table.Cell>
            <Table.Cell>
              <Button size="sm" variant="ghost" class="h-7 w-7 p-0 text-red-500 hover:text-red-600" onclick={() => killProcessById(proc.pid)}>
                <Icon icon="tdesign:close" class="size-4" />
              </Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </ScrollArea>
</Card.Root>
