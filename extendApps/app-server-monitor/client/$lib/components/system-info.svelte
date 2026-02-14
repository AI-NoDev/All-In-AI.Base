<script lang="ts">
  import { cn } from '../utils';

  interface SystemData {
    uptime: number;
    processes: number;
    os: string;
    hostname: string;
    platform: string;
    arch: string;
  }

  interface Props {
    system: SystemData;
    class?: string;
  }

  let { system, class: className }: Props = $props();

  function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);
    
    return parts.length > 0 ? parts.join(' ') : '< 1分钟';
  }
</script>

<div class={cn('rounded-lg border bg-card p-4', className)}>
  <h3 class="mb-4 font-medium">系统信息</h3>
  <div class="space-y-2 text-sm">
    <div class="flex justify-between">
      <span class="text-muted-foreground">主机名</span>
      <span class="font-medium">{system.hostname}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-muted-foreground">操作系统</span>
      <span class="font-medium truncate max-w-[180px]" title={system.os}>{system.os}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-muted-foreground">平台</span>
      <span class="font-medium">{system.platform} ({system.arch})</span>
    </div>
    <div class="flex justify-between">
      <span class="text-muted-foreground">运行时间</span>
      <span class="font-medium">{formatUptime(system.uptime)}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-muted-foreground">进程数</span>
      <span class="font-medium">{system.processes}</span>
    </div>
  </div>
</div>
