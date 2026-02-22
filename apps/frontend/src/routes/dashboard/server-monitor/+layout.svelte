
<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import * as Tabs from '$lib/components/ui/tabs';
  import { onMount, onDestroy } from 'svelte';
  import { wsStore } from '$lib/stores/websocket.svelte';
  import { initMonitorChannel, destroyMonitorChannel, onMetrics, type MetricsSnapshot } from '$lib/stores/ws-channels/monitor.svelte';
  import { setContext } from 'svelte';
  import { t } from '$lib/stores/i18n.svelte';

  let { children } = $props();

  interface SystemInfo {
    hostname: string;
    platform: string;
    release: string;
    arch: string;
    uptime: number;
    timezone: string;
    currentTime: string;
    cpu: { model: string; cores: number; threads: number; speed: number };
    memory: { total: number; used: number; free: number; swapTotal: number; swapUsed: number; swapFree: number };
    network: { interfaces: NetworkInterface[]; publicIp: string };
  }

  interface NetworkInterface {
    name: string;
    mac: string;
    ipv4: string[];
    ipv6: string[];
    status: string;
  }

  interface DiskPartition {
    name: string;
    mountPoint: string;
    fsType: string;
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  }

  let systemInfo = $state<SystemInfo | null>(null);
  let currentMetrics = $state<MetricsSnapshot | null>(null);
  let diskPartitions = $state<DiskPartition[]>([]);
  let metricsUnsubscribe: (() => void) | null = null;
  let loading = $state(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

  // Provide data to child components via context
  setContext('monitor-data', {
    get systemInfo() { return systemInfo; },
    get currentMetrics() { return currentMetrics; },
    get diskPartitions() { return diskPartitions; },
    get loading() { return loading; },
    API_BASE
  });

  async function loadSystemInfo() {
    try {
      const res = await fetch(`${API_BASE}/api/monitor/system/info`);
      systemInfo = await res.json();
    } catch (e) {
      console.error('Failed to load system info:', e);
    }
  }

  async function loadDiskPartitions() {
    try {
      const res = await fetch(`${API_BASE}/api/monitor/disk/partitions`);
      diskPartitions = await res.json();
    } catch (e) {
      console.error('Failed to load disk partitions:', e);
    }
  }

  function connectMonitorChannel() {
    wsStore.connect(['monitor']);
    initMonitorChannel();
    metricsUnsubscribe = onMetrics((snapshot) => {
      currentMetrics = snapshot;
    });
  }

  onMount(async () => {
    await Promise.all([loadSystemInfo(), loadDiskPartitions()]);
    connectMonitorChannel();
    loading = false;
  });

  onDestroy(() => {
    if (metricsUnsubscribe) metricsUnsubscribe();
    destroyMonitorChannel();
  });

  // Determine active tab based on current path
  let activeTab = $derived.by(() => {
    const path = page.url.pathname;
    if (path.includes('/charts')) return 'charts';
    if (path.includes('/processes')) return 'processes';
    if (path.includes('/ports')) return 'ports';
    return 'overview';
  });

  function handleTabChange(value: string) {
    goto(`/dashboard/server-monitor/${value}`);
  }
</script>

<div class="flex-1 flex flex-col min-h-0 p-4 lg:p-6 space-y-4 overflow-hidden">
  <Tabs.Root value={activeTab} onValueChange={handleTabChange} class="flex flex-col flex-1 min-h-0">
    <Tabs.List>
      <Tabs.Trigger value="overview">{t('page.monitor.overview')}</Tabs.Trigger>
      <Tabs.Trigger value="charts">{t('page.monitor.charts')}</Tabs.Trigger>
      <Tabs.Trigger value="processes">{t('page.monitor.processes')}</Tabs.Trigger>
      <Tabs.Trigger value="ports">{t('page.monitor.ports')}</Tabs.Trigger>
    </Tabs.List>

    <div class="mt-4 flex-1 flex flex-col min-h-0 overflow-hidden">
      {@render children()}
    </div>
  </Tabs.Root>
</div>
