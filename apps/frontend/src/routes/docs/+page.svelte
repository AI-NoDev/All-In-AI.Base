<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    // 重定向到快速开始页面
    goto('/docs/zh-CN/guide/getting-started/');
  });
</script>

<div class="flex h-full items-center justify-center">
  <p class="text-muted-foreground">正在跳转...</p>
</div>
