<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    value: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    sublabel?: string;
    class?: string;
  }

  let { value, size = 120, strokeWidth = 8, label, sublabel, class: className }: Props = $props();

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = $derived(circumference - (value / 100) * circumference);
  
  const colorClass = $derived(
    value >= 90 ? 'text-red-500' :
    value >= 70 ? 'text-yellow-500' :
    'text-green-500'
  );
</script>

<div class={cn('relative inline-flex items-center justify-center', className)}>
  <svg width={size} height={size} class="-rotate-90">
    <!-- 背景圆环 -->
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      class="text-muted/30"
    />
    <!-- 进度圆环 -->
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      class={cn('transition-all duration-500', colorClass)}
    />
  </svg>
  <div class="absolute flex flex-col items-center justify-center">
    <span class={cn('text-xl font-bold', colorClass)}>{value.toFixed(1)}%</span>
    {#if label}
      <span class="text-xs text-muted-foreground">{label}</span>
    {/if}
    {#if sublabel}
      <span class="text-xs text-muted-foreground">{sublabel}</span>
    {/if}
  </div>
</div>
