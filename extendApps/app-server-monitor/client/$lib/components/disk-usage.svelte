<script lang="ts">
  import { cn } from '../utils';

  interface DiskInfo {
    fs: string;
    mount: string;
    size: number;
    used: number;
    available: number;
    usagePercent: number;
  }

  interface Props {
    disks: DiskInfo[];
    class?: string;
  }

  let { disks, class: className }: Props = $props();

  function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  function getProgressColor(percent: number): string {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  function getTextColor(percent: number): string {
    if (percent >= 90) return 'text-red-500';
    if (percent >= 70) return 'text-yellow-500';
    return 'text-green-500';
  }
</script>

<div class={cn('rounded-lg border bg-card p-4', className)}>
  <h3 class="mb-4 font-medium">磁盘使用</h3>
  <div class="space-y-4">
    {#each disks as disk}
      <div>
        <div class="mb-1 flex items-center justify-between text-sm">
          <span class="font-medium truncate max-w-[120px]" title={disk.mount}>{disk.mount}</span>
          <span class="text-muted-foreground">
            {formatBytes(disk.used)} / {formatBytes(disk.size)}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <div class="bg-primary/20 relative h-2 flex-1 overflow-hidden rounded-full">
            <div 
              class={cn('h-full transition-all', getProgressColor(disk.usagePercent))}
              style="width: {disk.usagePercent}%"
            ></div>
          </div>
          <span class={cn('text-xs font-medium w-12 text-right', getTextColor(disk.usagePercent))}>
            {disk.usagePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>
