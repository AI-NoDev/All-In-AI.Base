<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { Area, AreaChart, ChartClipPath } from 'layerchart';
  import { scaleUtc } from 'd3-scale';
  import { curveMonotoneX } from 'd3-shape';
  import { cubicInOut } from 'svelte/easing';
  import { getContext } from 'svelte';
  import { t } from '@/lib/stores/i18n.svelte';

  const monitorData = getContext('monitor-data');
  const API_BASE = monitorData.API_BASE;

  interface HistoryMetric {
    timestamp: number;
    avg: number;
    max: number;
    min: number;
  }

  interface ChartDataPoint {
    date: Date;
    cpu: number;
    memory: number;
  }

  let timeRange = $state('1h');
  let chartData = $state<ChartDataPoint[]>([]);

  let chartConfig = $derived({
    cpu: { label: t('page.monitor.cpu'), color: "var(--chart-1)" },
    memory: { label: t('page.monitor.memory'), color: "var(--chart-2)" },
  } satisfies Chart.ChartConfig);

  async function loadHistoryMetrics() {
    try {
      const [cpuRes, memRes] = await Promise.all([
        fetch(`${API_BASE}/api/monitor/metrics?type=cpu&range=${timeRange}`),
        fetch(`${API_BASE}/api/monitor/metrics?type=memory&range=${timeRange}`),
      ]);
      const cpuData: HistoryMetric[] = await cpuRes.json();
      const memData: HistoryMetric[] = await memRes.json();
      
      // 合并 CPU 和内存数据到同一个数据集
      const dataMap = new Map<number, ChartDataPoint>();
      
      cpuData.forEach(d => {
        dataMap.set(d.timestamp, {
          date: new Date(d.timestamp * 1000),
          cpu: d.avg,
          memory: 0,
        });
      });
      
      memData.forEach(d => {
        const existing = dataMap.get(d.timestamp);
        if (existing) {
          existing.memory = d.avg;
        } else {
          dataMap.set(d.timestamp, {
            date: new Date(d.timestamp * 1000),
            cpu: 0,
            memory: d.avg,
          });
        }
      });
      
      // 按时间排序
      chartData = Array.from(dataMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (e) {
      console.error('Failed to load history metrics:', e);
    }
  }

  $effect(() => {
    if (timeRange) loadHistoryMetrics();
  });

  function formatXAxis(v: Date): string {
    if (timeRange === '7d' || timeRange === '30d') {
      return v.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
    return v.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
</script>

<div class="flex flex-col min-h-0 overflow-auto">
  <div class="flex justify-end mb-4">
    <ToggleGroup.Root type="single" bind:value={timeRange} variant="outline">
      <ToggleGroup.Item value="1h">{t('page.monitor.timeRange1h')}</ToggleGroup.Item>
      <ToggleGroup.Item value="24h">{t('page.monitor.timeRange24h')}</ToggleGroup.Item>
      <ToggleGroup.Item value="7d">{t('page.monitor.timeRange7d')}</ToggleGroup.Item>
      <ToggleGroup.Item value="30d">{t('page.monitor.timeRange30d')}</ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>{t('page.monitor.systemResourceUsage')}</Card.Title>
      <Card.Description class="flex gap-6">
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" style="background: var(--chart-1)"></span>
          {t('page.monitor.cpu')}: {monitorData.currentMetrics?.cpu.toFixed(1) || 0}%
        </span>
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" style="background: var(--chart-2)"></span>
          {t('page.monitor.memory')}: {monitorData.currentMetrics?.memory.toFixed(1) || 0}%
        </span>
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="h-[400px] w-full">
        {#if chartData.length > 0}
          <Chart.Container config={chartConfig} class="h-full w-full">
            <AreaChart
              legend
              data={chartData}
              x="date"
              xScale={scaleUtc()}
              yDomain={[0, 100]}
              series={[
                {
                  key: "cpu",
                  label: t('page.monitor.cpu'),
                  color: chartConfig.cpu.color,
                },
                {
                  key: "memory",
                  label: t('page.monitor.memory'),
                  color: chartConfig.memory.color,
                },
              ]}
              props={{
                area: {
                  curve: curveMonotoneX,
                  "fill-opacity": 0.3,
                  line: { class: "stroke-2" },
                  motion: "tween",
                },
                xAxis: {
                  format: formatXAxis,
                },
                yAxis: { 
                  format: (v) => `${v}%`,
                },
              }}
            >
              {#snippet marks({ series, getAreaProps })}
                <defs>
                  <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="var(--color-cpu)" stop-opacity={0.8} />
                    <stop offset="95%" stop-color="var(--color-cpu)" stop-opacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="var(--color-memory)" stop-opacity={0.8} />
                    <stop offset="95%" stop-color="var(--color-memory)" stop-opacity={0.1} />
                  </linearGradient>
                </defs>
                <ChartClipPath
                  initialWidth={0}
                  motion={{
                    width: { type: "tween", duration: 1000, easing: cubicInOut },
                  }}
                >
                  {#each series as s, i (s.key)}
                    <Area
                      {...getAreaProps(s, i)}
                      fill={s.key === "cpu" ? "url(#fillCpu)" : "url(#fillMemory)"}
                    />
                  {/each}
                </ChartClipPath>
              {/snippet}
              {#snippet tooltip()}
                <Chart.Tooltip
                  labelFormatter={(v: Date) => v.toLocaleString('zh-CN')}
                  indicator="line"
                />
              {/snippet}
            </AreaChart>
          </Chart.Container>
        {:else}
          <div class="h-full flex items-center justify-center text-muted-foreground">{t('tips.noData')}</div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</div>
