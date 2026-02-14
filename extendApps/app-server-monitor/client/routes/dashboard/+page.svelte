<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import RefreshIcon from '@iconify-svelte/tdesign/refresh';
  import { Button } from '$lib/components/ui/button';
  import StatCard from '../../$lib/components/stat-card.svelte';
  import ProgressRing from '../../$lib/components/progress-ring.svelte';
  import DiskUsage from '../../$lib/components/disk-usage.svelte';
  import NetworkStats from '../../$lib/components/network-stats.svelte';
  import SystemInfo from '../../$lib/components/system-info.svelte';
  import MetricChart from '../../$lib/components/metric-chart.svelte';

  // 类型定义
  interface DiskInfo {
    fs: string;
    mount: string;
    size: number;
    used: number;
    available: number;
    usagePercent: number;
  }

  interface NetworkInfo {
    iface: string;
    rxSec: number;
    txSec: number;
  }

  interface ServerMetrics {
    timestamp: number;
    cpu: {
      usage: number;
      cores: number;
      loadavg: number[];
      temperature?: number;
    };
    memory: {
      total: number;
      used: number;
      available: number;
      usagePercent: number;
      swapTotal?: number;
      swapUsed?: number;
      swapUsedPercent?: number;
    };
    disk: DiskInfo[];
    diskIO?: {
      readSpeed: number;
      writeSpeed: number;
    };
    network: NetworkInfo[];
    system: {
      uptime: number;
      processes: number;
      os: string;
      hostname: string;
      platform: string;
      arch: string;
    };
  }

  // 工具函数
  function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  let metrics = $state<ServerMetrics | null>(null);
  let history = $state<ServerMetrics[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let ws = $state<WebSocket | null>(null);
  let connected = $state(false);

  // 历史数据提取
  const cpuHistory = $derived(history.map(h => h.cpu.usage));
  const memoryHistory = $derived(history.map(h => h.memory.usagePercent));
  const networkRxHistory = $derived(history.map(h => 
    h.network.reduce((sum, n) => sum + n.rxSec, 0) / 1024 / 1024
  ));
  const networkTxHistory = $derived(history.map(h => 
    h.network.reduce((sum, n) => sum + n.txSec, 0) / 1024 / 1024
  ));

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/app-server-monitor/metrics');
      const data = await res.json();
      metrics = data.data;
      error = null;
    } catch (err) {
      error = '获取指标失败';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch('/api/app-server-monitor/history');
      const data = await res.json();
      history = data.data || [];
    } catch (err) {
      console.error('获取历史数据失败:', err);
    }
  }

  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/app-server-monitor/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      connected = true;
      ws?.send(JSON.stringify({ type: 'getHistory' }));
    };
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'metrics') {
          metrics = msg.data;
          history = [...history.slice(-59), msg.data];
          loading = false;
          error = null;
        } else if (msg.type === 'history') {
          history = msg.data || [];
        }
      } catch (err) {
        console.error('解析消息失败:', err);
      }
    };
    
    ws.onclose = () => {
      connected = false;
      setTimeout(connectWebSocket, 3000);
    };
    
    ws.onerror = () => {
      connected = false;
    };
  }

  let pollInterval: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    fetchMetrics();
    fetchHistory();
    connectWebSocket();
    
    pollInterval = setInterval(() => {
      if (!connected) {
        fetchMetrics();
      }
    }, 2000);
  });

  onDestroy(() => {
    if (ws) ws.close();
    if (pollInterval) clearInterval(pollInterval);
  });

  function handleRefresh() {
    loading = true;
    fetchMetrics();
    fetchHistory();
  }
</script>

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <div class="flex items-center justify-between py-4">
    <div>
      <h1 class="text-xl font-semibold">服务器监控</h1>
      <p class="text-muted-foreground text-sm mt-1">
        实时监控服务器性能指标
        {#if connected}
          <span class="ml-2 inline-flex items-center gap-1 text-green-500">
            <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
            已连接
          </span>
        {:else}
          <span class="ml-2 inline-flex items-center gap-1 text-yellow-500">
            <span class="size-2 rounded-full bg-yellow-500"></span>
            轮询中
          </span>
        {/if}
      </p>
    </div>
    <Button variant="outline" size="sm" onclick={handleRefresh} disabled={loading}>
      <RefreshIcon class="size-4 mr-1" />
      刷新
    </Button>
  </div>

  {#if loading && !metrics}
    <div class="flex items-center justify-center h-64">
      <span class="text-muted-foreground">加载中...</span>
    </div>
  {:else if error && !metrics}
    <div class="flex items-center justify-center h-64">
      <span class="text-red-500">{error}</span>
    </div>
  {:else if metrics}
    <div class="flex-1 min-h-0 overflow-y-auto space-y-6">
      <!-- 核心指标环形图 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex flex-col items-center justify-center rounded-lg border bg-card p-4">
          <ProgressRing 
            value={metrics.cpu.usage} 
            label="CPU"
            sublabel="{metrics.cpu.cores} 核心"
          />
        </div>
        <div class="flex flex-col items-center justify-center rounded-lg border bg-card p-4">
          <ProgressRing 
            value={metrics.memory.usagePercent} 
            label="内存"
            sublabel="{formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}"
          />
        </div>
        <div class="flex flex-col items-center justify-center rounded-lg border bg-card p-4">
          {#if metrics.disk.length > 0}
            <ProgressRing 
              value={metrics.disk[0].usagePercent} 
              label="主磁盘"
              sublabel={metrics.disk[0].mount}
            />
          {:else}
            <ProgressRing value={0} label="磁盘" sublabel="N/A" />
          {/if}
        </div>
        <div class="flex flex-col items-center justify-center rounded-lg border bg-card p-4">
          {#if metrics.memory.swapUsedPercent !== undefined}
            <ProgressRing 
              value={metrics.memory.swapUsedPercent} 
              label="Swap"
              sublabel="{formatBytes(metrics.memory.swapUsed || 0)} / {formatBytes(metrics.memory.swapTotal || 0)}"
            />
          {:else}
            <ProgressRing value={0} label="Swap" sublabel="N/A" />
          {/if}
        </div>
      </div>

      <!-- 趋势图 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricChart title="CPU 使用率" data={cpuHistory} color="#22c55e" />
        <MetricChart title="内存使用率" data={memoryHistory} color="#3b82f6" />
        <MetricChart title="网络下载" data={networkRxHistory} color="#10b981" unit=" MB/s" formatValue={(v) => v.toFixed(2)} />
        <MetricChart title="网络上传" data={networkTxHistory} color="#6366f1" unit=" MB/s" formatValue={(v) => v.toFixed(2)} />
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SystemInfo system={metrics.system} />
        <NetworkStats networks={metrics.network} />
        <DiskUsage disks={metrics.disk} />
      </div>

      <!-- 额外指标卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="CPU 温度" 
          value={metrics.cpu.temperature !== undefined ? `${metrics.cpu.temperature.toFixed(1)}°C` : 'N/A'}
          icon="tdesign:thermometer"
        />
        <StatCard title="进程数" value={String(metrics.system.processes)} icon="tdesign:task" />
        {#if metrics.diskIO}
          <StatCard title="磁盘读取" value={formatBytes(metrics.diskIO.readSpeed) + '/s'} icon="tdesign:download" />
          <StatCard title="磁盘写入" value={formatBytes(metrics.diskIO.writeSpeed) + '/s'} icon="tdesign:upload" />
        {:else}
          <StatCard title="磁盘读取" value="N/A" icon="tdesign:download" />
          <StatCard title="磁盘写入" value="N/A" icon="tdesign:upload" />
        {/if}
      </div>
    </div>
  {/if}
</div>
