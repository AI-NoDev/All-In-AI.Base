<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background px-4">
  <div class="text-center space-y-6">
    <div class="space-y-2">
      <h1 class="text-9xl font-bold text-muted-foreground/20">{page.status}</h1>
      <h2 class="text-2xl font-semibold tracking-tight">
        {#if page.status === 404}
          页面未找到
        {:else}
          出错了
        {/if}
      </h2>
      <p class="text-muted-foreground">
        {page.error?.message || '抱歉，您访问的页面不存在或已被移除'}
      </p>
    </div>

    <div class="flex items-center justify-center gap-4">
      <Button variant="outline" onclick={() => history.back()}>返回上页</Button>
      <Button onclick={() => goto('/')}>回到首页</Button>
    </div>
  </div>
</div>
