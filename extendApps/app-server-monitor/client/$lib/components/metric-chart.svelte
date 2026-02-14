<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    title: string;
    data: number[];
    maxPoints?: number;
    height?: number;
    color?: string;
    unit?: string;
    formatValue?: (v: number) => string;
    class?: string;
  }

  let { 
    title, 
    data, 
    maxPoints = 60, 
    height = 100, 
    color = '#22c55e',
    unit = '%',
    formatValue = (v: number) => v.toFixed(1),
    class: className 
  }: Props = $props();

  // 限制数据点数量
  const chartData = $derived(data.slice(-maxPoints));
  const currentValue = $derived(chartData.length > 0 ? chartData[chartData.length - 1] : 0);
  const maxValue = $derived(Math.max(...chartData, 100));
  
  // 生成 SVG 路径
  const pathD = $derived(() => {
    if (chartData.length < 2) return '';
    const width = 100;
    const step = width / (maxPoints - 1);
    const startIndex = maxPoints - chartData.length;
    
    return chartData.map((v, i) => {
      const x = (startIndex + i) * step;
      const y = height - (v / maxValue) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  });
  
  const areaD = $derived(() => {
    if (chartData.length < 2) return '';
    const width = 100;
    const step = width / (maxPoints - 1);
    const startIndex = maxPoints - chartData.length;
    
    const points = chartData.map((v, i) => {
      const x = (startIndex + i) * step;
      const y = height - (v / maxValue) * height;
      return `${x},${y}`;
    });
    
    const startX = startIndex * step;
    const endX = (startIndex + chartData.length - 1) * step;
    return `M ${startX},${height} L ${points.join(' L ')} L ${endX},${height} Z`;
  });
</script>

<div class={cn('rounded-lg border bg-card p-4', className)}>
  <div class="mb-2 flex items-center justify-between">
    <h3 class="font-medium">{title}</h3>
    <span class="text-lg font-bold" style="color: {color}">{formatValue(currentValue)}{unit}</span>
  </div>
  <svg viewBox="0 0 100 {height}" preserveAspectRatio="none" class="w-full" style="height: {height}px">
    <!-- 网格线 -->
    {#each [0, 25, 50, 75, 100] as pct}
      <line 
        x1="0" 
        y1={height - (pct / 100) * height} 
        x2="100" 
        y2={height - (pct / 100) * height}
        stroke="currentColor"
        stroke-opacity="0.1"
        stroke-width="0.5"
      />
    {/each}
    <!-- 填充区域 -->
    <path
      d={areaD()}
      fill={color}
      fill-opacity="0.1"
    />
    <!-- 折线 -->
    <path
      d={pathD()}
      fill="none"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>
