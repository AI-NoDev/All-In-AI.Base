<script lang="ts">
  import { cn } from '../utils';
  import ArrowDownIcon from '@iconify-svelte/tdesign/arrow-down';
  import ArrowUpIcon from '@iconify-svelte/tdesign/arrow-up';

  interface NetworkInfo {
    iface: string;
    rxSec: number;
    txSec: number;
  }

  interface Props {
    networks: NetworkInfo[];
    class?: string;
  }

  let { networks, class: className }: Props = $props();

  function formatBytesPerSec(bytes: number): string {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 过滤活跃的网络接口
  const activeNetworks = $derived(
    networks.filter(n => n.rxSec > 0 || n.txSec > 0 || n.iface.startsWith('eth') || n.iface.startsWith('en'))
  );
</script>

<div class={cn('rounded-lg border bg-card p-4', className)}>
  <h3 class="mb-4 font-medium">网络流量</h3>
  <div class="space-y-3">
    {#each activeNetworks.length > 0 ? activeNetworks : networks.slice(0, 3) as net}
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium truncate max-w-[100px]" title={net.iface}>{net.iface}</span>
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-1 text-green-500">
            <ArrowDownIcon class="size-3" />
            <span>{formatBytesPerSec(net.rxSec)}</span>
          </div>
          <div class="flex items-center gap-1 text-blue-500">
            <ArrowUpIcon class="size-3" />
            <span>{formatBytesPerSec(net.txSec)}</span>
          </div>
        </div>
      </div>
    {/each}
    {#if networks.length === 0}
      <div class="text-sm text-muted-foreground text-center py-2">暂无数据</div>
    {/if}
  </div>
</div>
