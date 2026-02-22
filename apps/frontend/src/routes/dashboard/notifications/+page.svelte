<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Separator } from '$lib/components/ui/separator';
  import * as Card from '$lib/components/ui/card';
  import { i18n, t } from '@/lib/stores/i18n.svelte';

  let _ = $derived(i18n.version);

  // 模拟通知数据
  interface Notification {
    id: string;
    title: string;
    content: string;
    time: string;
    read: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
  }

  let notifications = $state<Notification[]>([]);
  let loading = $state(false);

  function getTypeIcon(type: Notification['type']) {
    switch (type) {
      case 'info': return 'tdesign:info-circle';
      case 'warning': return 'tdesign:error-circle';
      case 'success': return 'tdesign:check-circle';
      case 'error': return 'tdesign:close-circle';
      default: return 'tdesign:info-circle';
    }
  }

  function getTypeColor(type: Notification['type']) {
    switch (type) {
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  }

  function markAsRead(id: string) {
    notifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
  }

  function markAllAsRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
  }

  function deleteNotification(id: string) {
    notifications = notifications.filter(n => n.id !== id);
  }

  let unreadCount = $derived(notifications.filter(n => !n.read).length);
</script>

<ScrollArea class="flex-1 h-full">
{#key _}
<div class="max-w-2xl px-4 lg:px-6 py-4 space-y-4">
  <!-- 标题栏 -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-semibold">{t('page.notifications.title')}</h2>
      <p class="text-sm text-muted-foreground">
        {unreadCount > 0 
          ? t('page.notifications.unreadCount').replace('${count}', String(unreadCount))
          : t('page.notifications.allRead')}
      </p>
    </div>
    {#if unreadCount > 0}
      <Button variant="outline" size="sm" onclick={markAllAsRead}>
        <Icon icon="tdesign:check-double" class="mr-2 size-4" />
        {t('page.notifications.markAllRead')}
      </Button>
    {/if}
  </div>

  <Separator />

  <!-- 通知列表 -->
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <Icon icon="tdesign:loading" class="size-8 animate-spin text-muted-foreground" />
    </div>
  {:else if notifications.length === 0}
    <Card.Root>
      <Card.Content class="flex flex-col items-center justify-center py-12">
        <Icon icon="tdesign:notification-filled" class="size-12 text-muted-foreground/50 mb-4" />
        <p class="text-muted-foreground">{t('page.notifications.empty')}</p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="space-y-3">
      {#each notifications as notification (notification.id)}
        <Card.Root class={notification.read ? 'opacity-60' : ''}>
          <Card.Content class="p-4">
            <div class="flex items-start gap-3">
              <Icon 
                icon={getTypeIcon(notification.type)} 
                class="size-5 mt-0.5 {getTypeColor(notification.type)}" 
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="font-medium truncate">{notification.title}</h4>
                  <span class="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">{notification.content}</p>
              </div>
              <div class="flex items-center gap-1">
                {#if !notification.read}
                  <Button variant="ghost" size="icon" class="size-8" onclick={() => markAsRead(notification.id)}>
                    <Icon icon="tdesign:check" class="size-4" />
                  </Button>
                {/if}
                <Button variant="ghost" size="icon" class="size-8" onclick={() => deleteNotification(notification.id)}>
                  <Icon icon="tdesign:delete" class="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>
{/key}
</ScrollArea>
