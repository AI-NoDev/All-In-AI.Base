
<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import * as Chart from '$lib/components/ui/chart';
  import { Area, AreaChart } from 'layerchart';
  import { scaleTime } from 'd3-scale';
  import { curveMonotoneX } from 'd3-shape';
  import { getContext } from 'svelte';

  const monitorData = getContext('monitor-data');
  const API_BASE = monitorData.API_BASE;

  interface HistoryMetric {
    timestamp: number;
    avg: number;
    max: number;
    min: number;
  }

  let timeRange = $state('1h');
  let cpuHistory = $state<{ date: Date; value: number }[]>([]);
  let memoryHistory = $state<{ date: Date; value: number }[]>([]);

  const cpuChartConfig = {
    value: { label: "CPU Usage", color: "hsl(var(--primary))" },
  } satisfies Chart.ChartConfig;

  const memoryChartConfig = {
    value: { label: "Memory Usage", color: "#3b82f6" },
  } satisfies Chart.ChartConfig;

  async function loadHistoryMetrics() {
    try {
      const [cpuRes, memRes] = await Promise.all([
        fetch(`${API_BASE}/api/monitor/metrics?type=cpu&range=${timeRange}`),
        fetch(`${API_BASE}/api/monitor/metrics?type=memory&range=${timeRange}`),
      ]);
      const cpuData: HistoryMetric[] = await cpuRes.json();
      const memData: HistoryMetric[] = await memRes.json();
      cpuHistory = cpuData.map(d => ({ date: new Date(d.timestamp * 1000), value: d.avg }));
      memoryHistory = memData.map(d => ({ date: new Date(d.timestamp * 1000), value: d.avg }));
    } catch (e) {
      console.error('Failed to load history metrics:', e);
    }
  }

  $effect(() => {
    if (timeRange) loadHistoryMetrics();
  });
</script>

<div class="flex justify-end mb-4">
  <ToggleGroup.Root type="single" bind:value={timeRange} variant="outline">
    <ToggleGroup.Item value="1h">1小时</ToggleGroup.Item>
    <ToggleGroup.Item value="24h">24小时</ToggleGroup.Item>
    <ToggleGroup.Item value="7d">7天</ToggleGroup.Item>
    <ToggleGroup.Item value="30d">30天</ToggleGroup.Item>
  </ToggleGroup.Root>
</div>

<Card.Root class="mb-4">
  <Card.Header>
    <Card.Title>CPU 使用率</Card.Title>
    <Card.Description>当前: {monitorData.currentMetrics?.cpu.toFixed(1) || 0}%</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="h-[300px] w-full">
      {#if cpuHistory.length > 0}
        <Chart.Container config={cpuChartConfig} class="h-full w-full">
          <AreaChart
            data={cpuHistory}
            x="date"
            y="value"
            xScale={scaleTime()}
            yDomain={[0, 100]}
            series={[
              {
                key: "value",
                label: "CPU",
                color: cpuChartConfig.value.color,
              },
            ]}
            props={{
              area: {
                curve: curveMonotoneX,
                "fill-opacity": 0.2,
                class: "fill-primary/20 stroke-primary stroke-2",
              },
              xAxis: {
                format: (v) => {
                  if (v instanceof Date) {
                      return v.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                  return "";
                },
                ticks: 5
              },
              yAxis: { format: (v) => `${v}%` },
            }}
          >
            {#snippet tooltip()}
              <Chart.Tooltip
                cursor={false}
                labelFormatter={(v) => {
                  if (v instanceof Date) return v.toLocaleString();
                  return "";
                }}
              />
            {/snippet}
          </AreaChart>
        </Chart.Container>
      {:else}
        <div class="h-full flex items-center justify-center text-muted-foreground">暂无数据</div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>

<Card.Root>
  <Card.Header>
    <Card.Title>内存使用率</Card.Title>
    <Card.Description>当前: {monitorData.currentMetrics?.memory.toFixed(1) || 0}%</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="h-[300px] w-full">
      {#if memoryHistory.length > 0}
        <Chart.Container config={memoryChartConfig} class="h-full w-full">
          <AreaChart
            data={memoryHistory}
            x="date"
            y="value"
            xScale={scaleTime()}
            yDomain={[0, 100]}
            series={[
              {
                key: "value",
                label: "Memory",
                color: memoryChartConfig.value.color,
              },
            ]}
            props={{
              area: {
                curve: curveMonotoneX,
                "fill-opacity": 0.2,
                class: "fill-blue-500/20 stroke-blue-500 stroke-2",
              },
              xAxis: {
                format: (v) => {
                  if (v instanceof Date) {
                      return v.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                  return "";
                },
                ticks: 5
              },
              yAxis: { format: (v) => `${v}%` },
            }}
          >
            {#snippet tooltip()}
              <Chart.Tooltip
                cursor={false}
                labelFormatter={(v) => {
                  if (v instanceof Date) return v.toLocaleString();
                  return "";
                }}
              />
            {/snippet}
          </AreaChart>
        </Chart.Container>
      {:else}
        <div class="h-full flex items-center justify-center text-muted-foreground">暂无数据</div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
