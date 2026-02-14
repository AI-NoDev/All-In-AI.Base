<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    title: string;
    value: string;
    subtitle?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
    class?: string;
  }

  let { title, value, subtitle, icon, trend, trendValue, class: className }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-card p-4', className)}>
  <div class="flex items-center justify-between">
    <span class="text-sm text-muted-foreground">{title}</span>
    {#if icon}
      <iconify-icon icon={icon} class="size-4 text-muted-foreground"></iconify-icon>
    {/if}
  </div>
  <div class="mt-2">
    <span class="text-2xl font-bold">{value}</span>
    {#if trend && trendValue}
      <span class={cn(
        'ml-2 text-xs',
        trend === 'up' && 'text-red-500',
        trend === 'down' && 'text-green-500',
        trend === 'stable' && 'text-muted-foreground'
      )}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
      </span>
    {/if}
  </div>
  {#if subtitle}
    <p class="mt-1 text-xs text-muted-foreground">{subtitle}</p>
  {/if}
</div>
