<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    data: number[];
    height?: number;
    color?: string;
    class?: string;
  }

  let { data, height = 40, color = 'currentColor', class: className }: Props = $props();

  const maxValue = $derived(Math.max(...data, 1));
  const points = $derived(() => {
    if (data.length === 0) return '';
    const width = 100;
    const step = width / Math.max(data.length - 1, 1);
    return data.map((v, i) => {
      const x = i * step;
      const y = height - (v / maxValue) * height;
      return `${x},${y}`;
    }).join(' ');
  });
  
  const areaPoints = $derived(() => {
    if (data.length === 0) return '';
    const width = 100;
    const step = width / Math.max(data.length - 1, 1);
    const linePoints = data.map((v, i) => {
      const x = i * step;
      const y = height - (v / maxValue) * height;
      return `${x},${y}`;
    });
    return `0,${height} ${linePoints.join(' ')} ${100},${height}`;
  });
</script>

<div class={cn('w-full', className)}>
  <svg viewBox="0 0 100 {height}" preserveAspectRatio="none" class="w-full" style="height: {height}px">
    <!-- 填充区域 -->
    <polygon
      points={areaPoints()}
      fill={color}
      fill-opacity="0.1"
    />
    <!-- 折线 -->
    <polyline
      points={points()}
      fill="none"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>
