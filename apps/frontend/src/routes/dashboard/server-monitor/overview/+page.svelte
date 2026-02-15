
<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '$lib/components/ui/card';
  import { Progress } from '$lib/components/ui/progress';
  import { Badge } from '$lib/components/ui/badge';
  import { getContext } from 'svelte';

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';
  const monitorData = getContext('monitor-data');

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}天 ${hours}小时 ${minutes}分钟`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  }

  function formatNetSpeed(bytesPerSec: number): string {
    if (bytesPerSec < 1024) return bytesPerSec + ' B/s';
    if (bytesPerSec < 1024 * 1024) return (bytesPerSec / 1024).toFixed(1) + ' KB/s';
    return (bytesPerSec / (1024 * 1024)).toFixed(1) + ' MB/s';
  }

  function getPlatformName(platform: string): string {
    const names: Record<string, string> = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' };
    return names[platform] || platform;
  }

  function getStatusColor(percent: number): string {
    if (percent >= 90) return 'text-red-500';
    if (percent >= 70) return 'text-yellow-500';
    return 'text-green-500';
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card.Root>
    <Card.Header class="pb-2">
      <Card.Title class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon icon="tdesign:server" class="size-4" />
        主机信息
      </Card.Title>
    </Card.Header>
    <Card.Content class="space-y-1">
      <p class="text-lg font-semibold">{monitorData.systemInfo?.hostname || '-'}</p>
      <p class="text-xs text-muted-foreground">{monitorData.systemInfo ? `${getPlatformName(monitorData.systemInfo.platform)} ${monitorData.systemInfo.release}` : '-'}</p>
      <p class="text-xs text-muted-foreground">{monitorData.systemInfo?.arch || '-'}</p>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header class="pb-2">
      <Card.Title class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon icon="tdesign:time" class="size-4" />
        运行时间
      </Card.Title>
    </Card.Header>
    <Card.Content class="space-y-1">
      <p class="text-lg font-semibold">{monitorData.systemInfo ? formatUptime(monitorData.systemInfo.uptime) : '-'}</p>
      <p class="text-xs text-muted-foreground">时区: {monitorData.systemInfo?.timezone || '-'}</p>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header class="pb-2">
      <Card.Title class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon icon="tdesign:cpu" class="size-4" />
        CPU
      </Card.Title>
    </Card.Header>
    <Card.Content class="space-y-1">
      <p class="text-lg font-semibold {getStatusColor(monitorData.currentMetrics?.cpu || 0)}">{monitorData.currentMetrics?.cpu.toFixed(1) || 0}%</p>
      <p class="text-xs text-muted-foreground">{monitorData.systemInfo?.cpu.model || '-'}</p>
      <p class="text-xs text-muted-foreground">{monitorData.systemInfo?.cpu.cores || 0} 核心 @ {monitorData.systemInfo?.cpu.speed || 0} MHz</p>
      <Progress value={monitorData.currentMetrics?.cpu || 0} class="mt-2 h-1.5" />
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header class="pb-2">
      <Card.Title class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon icon="tdesign:memory" class="size-4" />
        内存
      </Card.Title>
    </Card.Header>
    <Card.Content class="space-y-1">
      <p class="text-lg font-semibold {getStatusColor(monitorData.currentMetrics?.memory || 0)}">{monitorData.currentMetrics?.memory.toFixed(1) || 0}%</p>
      <p class="text-xs text-muted-foreground">{formatBytes(monitorData.currentMetrics?.memoryUsed || 0)} / {formatBytes(monitorData.systemInfo?.memory.total || 0)}</p>
      <Progress value={monitorData.currentMetrics?.memory || 0} class="mt-2 h-1.5" />
    </Card.Content>
  </Card.Root>
</div>

<!-- 磁盘和网络 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
  <Card.Root>
    <Card.Header>
      <Card.Title class="text-sm font-medium flex items-center gap-2">
        <Icon icon="tdesign:hard-disk" class="size-4" />
        磁盘分区
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="space-y-3">
        {#each monitorData.diskPartitions as partition}
          <div class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="font-medium">{partition.name}</span>
              <span class="text-muted-foreground {getStatusColor(partition.usedPercent)}">{partition.usedPercent}%</span>
            </div>
            <Progress value={partition.usedPercent} class="h-1.5" />
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>{formatBytes(partition.used)} 已用</span>
              <span>{formatBytes(partition.free)} 可用</span>
            </div>
          </div>
        {/each}
        {#if monitorData.diskPartitions.length === 0}
          <p class="text-sm text-muted-foreground text-center py-4">暂无数据</p>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header>
      <Card.Title class="text-sm font-medium flex items-center gap-2">
        <Icon icon="tdesign:internet" class="size-4" />
        网络信息
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <Icon icon="tdesign:download" class="size-5 text-green-500" />
            <div>
              <p class="text-sm font-medium">{formatNetSpeed(monitorData.currentMetrics?.netRx || 0)}</p>
              <p class="text-xs text-muted-foreground">下载</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="tdesign:upload" class="size-5 text-blue-500" />
            <div>
              <p class="text-sm font-medium">{formatNetSpeed(monitorData.currentMetrics?.netTx || 0)}</p>
              <p class="text-xs text-muted-foreground">上传</p>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          {#each (monitorData.systemInfo?.network.interfaces || []).slice(0, 3) as iface}
            <div class="text-sm border rounded p-2">
              <div class="flex justify-between">
                <span class="font-medium">{iface.name}</span>
                <Badge variant="outline" class="text-xs">{iface.status}</Badge>
              </div>
              {#if iface.ipv4.length > 0}
                <p class="text-xs text-muted-foreground">IPv4: {iface.ipv4.join(', ')}</p>
              {/if}
              {#if iface.mac}
                <p class="text-xs text-muted-foreground">MAC: {iface.mac}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
