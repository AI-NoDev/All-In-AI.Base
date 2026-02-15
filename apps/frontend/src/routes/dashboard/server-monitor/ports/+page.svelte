
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { getContext } from 'svelte';

  const monitorData = getContext('monitor-data');
  const API_BASE = monitorData.API_BASE;

  interface PortInfo {
    protocol: string;
    localAddress: string;
    localPort: number;
    remoteAddress: string;
    remotePort: number;
    state: string;
    pid: number;
    processName: string;
  }

  let ports = $state<PortInfo[]>([]);

  async function loadPorts() {
    try {
      const res = await fetch(`${API_BASE}/api/monitor/ports`);
      ports = await res.json();
    } catch (e) {
      console.error('Failed to load ports:', e);
    }
  }

  onMount(() => {
    loadPorts();
    const interval = setInterval(loadPorts, 5000);
    return () => clearInterval(interval);
  });
</script>

<div class="flex justify-between items-center mb-4">
  <p class="text-sm text-muted-foreground">共 {ports.length} 个连接</p>
  <Button size="sm" variant="outline" onclick={loadPorts}>
    <Icon icon="tdesign:refresh" class="size-4 mr-1" />
    刷新
  </Button>
</div>

<Card.Root>
  <ScrollArea class="h-[500px]">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-16">协议</Table.Head>
          <Table.Head>本地地址</Table.Head>
          <Table.Head class="w-20">本地端口</Table.Head>
          <Table.Head>远程地址</Table.Head>
          <Table.Head class="w-20">远程端口</Table.Head>
          <Table.Head class="w-28">状态</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each ports as port}
          <Table.Row>
            <Table.Cell>
              <Badge variant="outline">{port.protocol}</Badge>
            </Table.Cell>
            <Table.Cell class="font-mono text-xs">{port.localAddress}</Table.Cell>
            <Table.Cell class="font-mono">{port.localPort}</Table.Cell>
            <Table.Cell class="font-mono text-xs">{port.remoteAddress || '-'}</Table.Cell>
            <Table.Cell class="font-mono">{port.remotePort || '-'}</Table.Cell>
            <Table.Cell>
              <Badge variant={port.state === 'Listen' || port.state === 'LISTEN' ? 'default' : 'secondary'}>
                {port.state}
              </Badge>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </ScrollArea>
</Card.Root>
