<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { getContext } from 'svelte';
  import * as Alert from '$lib/components/ui/alert';

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
    _uniqueKey?: string;
  }

  let ports = $state<PortInfo[]>([]);
  let unavailableMessage = $state<string | null>(null);

  async function loadPorts() {
    try {
      const res = await fetch(`${API_BASE}/api/monitor/ports`);
      const data = await res.json();
      if (data && typeof data === 'object' && 'unavailable' in data) {
        unavailableMessage = data.unavailable;
        ports = [];
      } else {
        unavailableMessage = null;
        // Add unique key for each port entry
        ports = Array.isArray(data) ? data.map((p: PortInfo, i: number) => ({
          ...p,
          _uniqueKey: `${p.protocol}-${p.localAddress}-${p.localPort}-${p.remoteAddress}-${p.remotePort}-${i}`
        })) : [];
      }
    } catch (e) {
      console.error('Failed to load ports:', e);
    }
  }

  onMount(() => {
    loadPorts();
    const interval = setInterval(loadPorts, 5000);
    return () => clearInterval(interval);
  });

  const columns = [
    { key: 'protocol', title: '协议', width: 64, render: protocolRender },
    { key: 'localAddress', title: '本地地址', width: 150, render: monoRender },
    { key: 'localPort', title: '本地端口', width: 80, render: portRender },
    { key: 'remoteAddress', title: '远程地址', width: 150, render: remoteAddrRender },
    { key: 'remotePort', title: '远程端口', width: 80, render: remotePortRender },
    { key: 'state', title: '状态', width: 112, render: stateRender },
  ];
</script>

{#snippet protocolRender({ value })}
  <Badge variant="outline">{value}</Badge>
{/snippet}

{#snippet monoRender({ value })}
  <span class="font-mono text-xs">{value}</span>
{/snippet}

{#snippet portRender({ value })}
  <span class="font-mono">{value}</span>
{/snippet}

{#snippet remoteAddrRender({ value })}
  <span class="font-mono text-xs">{value || '-'}</span>
{/snippet}

{#snippet remotePortRender({ value })}
  <span class="font-mono">{value || '-'}</span>
{/snippet}

{#snippet stateRender({ value })}
  <Badge variant={value === 'Listen' || value === 'LISTEN' ? 'default' : 'secondary'}>
    {value}
  </Badge>
{/snippet}

{#if unavailableMessage}
  <Alert.Root variant="default" class="mb-4">
    <Icon icon="tdesign:info-circle" class="size-4" />
    <Alert.Title>功能不可用</Alert.Title>
    <Alert.Description>{unavailableMessage}</Alert.Description>
  </Alert.Root>
{:else}
  <div class="flex justify-between items-center mb-4">
    <p class="text-sm text-muted-foreground">共 {ports.length} 个连接</p>
    <Button size="sm" variant="outline" onclick={loadPorts}>
      <Icon icon="tdesign:refresh" class="size-4 mr-1" />
      刷新
    </Button>
  </div>
{/if}

<DataTable {columns} data={ports} rowKey="_uniqueKey" class="h-[500px]" />
