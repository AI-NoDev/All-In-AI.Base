<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Separator } from '$lib/components/ui/separator';
  import { Switch } from '$lib/components/ui/switch';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Card from '$lib/components/ui/card';
  import * as Tabs from '$lib/components/ui/tabs';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import MarkdownPreview from '$lib/components/common/markdown-preview.svelte';
  import NoticeDialog from './components/notice-dialog.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { notificationStore } from '@/lib/stores/notification.svelte';
  import { i18n, t } from '@/lib/stores/i18n.svelte';
  import { toast } from 'svelte-sonner';

  let _ = $derived(i18n.version);

  interface NoticeItem {
    id: string;
    title: string;
    type: string;
    content: string;
    status: string;
    targetType: string;
    targetUserIds: string[] | null;
    publishedAt: string | null;
    createdAt: string;
    createdBy: string;
    isRead?: boolean;
    readAt?: string | null;
  }

  const NOTICE_TYPE = { NOTICE: '1', ANNOUNCEMENT: '2' };
  const NOTICE_STATUS = { DRAFT: '0', PUBLISHED: '1', WITHDRAWN: '2' };

  // State
  let notices = $state<NoticeItem[]>([]);
  let loading = $state(false);
  let activeTab = $state<'my' | 'manage'>('my');
  let showUnreadOnly = $state(false);
  let dialogOpen = $state(false);
  let editingNotice = $state<NoticeItem | null>(null);
  let viewingNotice = $state<NoticeItem | null>(null);
  let deleteConfirmOpen = $state(false);
  let deletingId = $state<string | null>(null);

  const api = authStore.createApi(true);

  // Check if user has manage permission
  const canManage = $derived(authStore.hasPermission('system:notice:edit'));

  let unreadCount = $derived(notices.filter(n => !n.isRead).length);

  async function loadMyNotices() {
    loading = true;
    try {
      const res = await api.system.postApiSystemNoticeMy({
        filter: showUnreadOnly ? { isRead: false } : undefined,
        sort: { field: 'createdAt', order: 'desc' },
        limit: 100,
      });
      notices = (res.data?.data || []) as NoticeItem[];
    } catch (err) {
      console.error('Failed to load notices:', err);
      toast.error(t('error.network.error'));
    } finally {
      loading = false;
    }
  }

  async function loadAllNotices() {
    loading = true;
    try {
      const res = await api.system.postApiSystemNoticeQuery({
        sort: { field: 'createdAt', order: 'desc' },
        limit: 100,
      });
      notices = (res.data?.data || []) as NoticeItem[];
    } catch (err) {
      console.error('Failed to load notices:', err);
      toast.error(t('error.network.error'));
    } finally {
      loading = false;
    }
  }

  function loadNotices() {
    if (activeTab === 'my') {
      loadMyNotices();
    } else {
      loadAllNotices();
    }
  }

  async function markAsRead(noticeId: string) {
    try {
      await api.system.postApiSystemNoticeReadMark({ noticeId });
      notices = notices.map(n => 
        n.id === noticeId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      );
      notificationStore.decrementCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }

  async function markAllAsRead() {
    const unreadIds = notices.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await api.system.postApiSystemNoticeReadMarkMany({ noticeIds: unreadIds });
      notices = notices.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }));
      notificationStore.fetchUnreadCount();
      toast.success(t('page.notifications.markAllRead'));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }

  async function publishNotice(id: string) {
    try {
      await api.system.postApiSystemNoticeByIdPublish({ id });
      toast.success(t('page.notifications.publishSuccess'));
      loadNotices();
    } catch (err) {
      console.error('Failed to publish:', err);
      toast.error(t('error.network.error'));
    }
  }

  async function withdrawNotice(id: string) {
    try {
      await api.system.postApiSystemNoticeByIdWithdraw({ id });
      toast.success(t('page.notifications.withdrawSuccess'));
      loadNotices();
    } catch (err) {
      console.error('Failed to withdraw:', err);
      toast.error(t('error.network.error'));
    }
  }

  async function deleteNotice() {
    if (!deletingId) return;
    try {
      await api.system.deleteApiSystemNoticeById({ id: deletingId });
      toast.success(t('page.notifications.deleteSuccess'));
      loadNotices();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error(t('error.network.error'));
    } finally {
      deleteConfirmOpen = false;
      deletingId = null;
    }
  }

  function openCreateDialog() {
    editingNotice = null;
    dialogOpen = true;
  }

  function openEditDialog(notice: NoticeItem) {
    editingNotice = notice;
    dialogOpen = true;
  }

  function openViewDialog(notice: NoticeItem) {
    viewingNotice = notice;
    if (!notice.isRead && activeTab === 'my') {
      markAsRead(notice.id);
    }
  }

  function getTypeLabel(type: string): string {
    return type === NOTICE_TYPE.ANNOUNCEMENT 
      ? t('page.notifications.typeAnnouncement') 
      : t('page.notifications.typeNotice');
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case NOTICE_STATUS.DRAFT: return t('page.notifications.statusDraft');
      case NOTICE_STATUS.PUBLISHED: return t('page.notifications.statusPublished');
      case NOTICE_STATUS.WITHDRAWN: return t('page.notifications.statusWithdrawn');
      default: return status;
    }
  }

  function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case NOTICE_STATUS.DRAFT: return 'secondary';
      case NOTICE_STATUS.PUBLISHED: return 'default';
      case NOTICE_STATUS.WITHDRAWN: return 'outline';
      default: return 'secondary';
    }
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  }

  $effect(() => {
    loadNotices();
  });

  $effect(() => {
    if (activeTab === 'my') {
      loadMyNotices();
    } else {
      loadAllNotices();
    }
  });

  onMount(() => {
    notificationStore.fetchUnreadCount();
  });
</script>

<ScrollArea class="flex-1 h-full">
{#key _}
<div class="max-w-4xl px-4 lg:px-6 py-4 space-y-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-semibold">{t('page.notifications.title')}</h2>
      {#if activeTab === 'my'}
        <p class="text-sm text-muted-foreground">
          {unreadCount > 0 
            ? t('page.notifications.unreadCount').replace('${count}', String(unreadCount))
            : t('page.notifications.allRead')}
        </p>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      {#if activeTab === 'my' && unreadCount > 0}
        <Button variant="outline" size="sm" onclick={markAllAsRead}>
          <Icon icon="tdesign:check-double" class="mr-2 size-4" />
          {t('page.notifications.markAllRead')}
        </Button>
      {/if}
      {#if canManage}
        <Button size="sm" onclick={openCreateDialog}>
          <Icon icon="tdesign:add" class="mr-2 size-4" />
          {t('page.notifications.createNotice')}
        </Button>
      {/if}
    </div>
  </div>

  <!-- Tabs -->
  {#if canManage}
    <Tabs.Root value={activeTab} onValueChange={(v) => activeTab = v as 'my' | 'manage'}>
      <Tabs.List>
        <Tabs.Trigger value="my">{t('page.notifications.title')}</Tabs.Trigger>
        <Tabs.Trigger value="manage">{t('common.manage')}</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  {/if}

  <!-- Filter for my notices -->
  {#if activeTab === 'my'}
    <div class="flex items-center gap-2">
      <Switch id="unread-only" bind:checked={showUnreadOnly} onCheckedChange={() => loadMyNotices()} />
      <label for="unread-only" class="text-sm cursor-pointer">{t('page.notifications.filterUnread')}</label>
    </div>
  {/if}

  <Separator />

  <!-- Notice List -->
  {#if loading}
    <div class="space-y-3">
      {#each [1, 2, 3] as _}
        <Card.Root>
          <Card.Content class="p-4">
            <Skeleton class="h-5 w-48 mb-2" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4 mt-1" />
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {:else if notices.length === 0}
    <Card.Root>
      <Card.Content class="flex flex-col items-center justify-center py-12">
        <Icon icon="tdesign:notification-filled" class="size-12 text-muted-foreground/50 mb-4" />
        <p class="text-muted-foreground">{t('page.notifications.empty')}</p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="space-y-3">
      {#each notices as notice (notice.id)}
        <Card.Root 
          class="cursor-pointer hover:bg-muted/30 transition-colors {activeTab === 'my' && !notice.isRead ? '' : 'opacity-80'}"
          onclick={() => openViewDialog(notice)}
        >
          <Card.Content class="p-4">
            <div class="flex items-start gap-3">
              <!-- Unread indicator -->
              {#if activeTab === 'my' && !notice.isRead}
                <div class="mt-1.5 size-2 rounded-full bg-primary shrink-0"></div>
              {:else}
                <div class="mt-1.5 size-2 shrink-0"></div>
              {/if}

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium truncate">{notice.title}</h4>
                  <Badge variant="outline" class="shrink-0">{getTypeLabel(notice.type)}</Badge>
                  {#if activeTab === 'manage'}
                    <Badge variant={getStatusVariant(notice.status)} class="shrink-0">
                      {getStatusLabel(notice.status)}
                    </Badge>
                  {/if}
                </div>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {notice.content || t('page.notifications.noContent')}
                </p>
                <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{formatDate(notice.publishedAt || notice.createdAt)}</span>
                  {#if activeTab === 'my' && notice.isRead && notice.readAt}
                    <span>{t('page.notifications.readAt')}: {formatDate(notice.readAt)}</span>
                  {/if}
                </div>
              </div>

              <!-- Actions -->
              {#if activeTab === 'manage'}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                      <Button {...props} variant="ghost" size="icon" class="size-8" onclick={(e: Event) => e.stopPropagation()}>
                        <Icon icon="tdesign:more" class="size-4" />
                      </Button>
                    {/snippet}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    <DropdownMenu.Item onclick={(e: Event) => { e.stopPropagation(); openEditDialog(notice); }}>
                      <Icon icon="tdesign:edit" class="mr-2 size-4" />
                      {t('page.notifications.edit')}
                    </DropdownMenu.Item>
                    {#if notice.status === NOTICE_STATUS.DRAFT}
                      <DropdownMenu.Item onclick={(e: Event) => { e.stopPropagation(); publishNotice(notice.id); }}>
                        <Icon icon="tdesign:send" class="mr-2 size-4" />
                        {t('page.notifications.publish')}
                      </DropdownMenu.Item>
                    {/if}
                    {#if notice.status === NOTICE_STATUS.PUBLISHED}
                      <DropdownMenu.Item onclick={(e: Event) => { e.stopPropagation(); withdrawNotice(notice.id); }}>
                        <Icon icon="tdesign:rollback" class="mr-2 size-4" />
                        {t('page.notifications.withdraw')}
                      </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item 
                      class="text-destructive"
                      onclick={(e: Event) => { e.stopPropagation(); deletingId = notice.id; deleteConfirmOpen = true; }}
                    >
                      <Icon icon="tdesign:delete" class="mr-2 size-4" />
                      {t('common.delete')}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              {:else if !notice.isRead}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="size-8 shrink-0" 
                  onclick={(e: Event) => { e.stopPropagation(); markAsRead(notice.id); }}
                >
                  <Icon icon="tdesign:check" class="size-4" />
                </Button>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>
{/key}
</ScrollArea>

<!-- View Notice Dialog -->
{#if viewingNotice}
  <AlertDialog.Root open={!!viewingNotice} onOpenChange={(v) => !v && (viewingNotice = null)}>
    <AlertDialog.Content class="max-w-2xl max-h-[80vh] flex flex-col">
      <AlertDialog.Header>
        <AlertDialog.Title class="flex items-center gap-2">
          {viewingNotice.title}
          <Badge variant="outline">{getTypeLabel(viewingNotice.type)}</Badge>
        </AlertDialog.Title>
        <AlertDialog.Description>
          {formatDate(viewingNotice.publishedAt || viewingNotice.createdAt)}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <div class="flex-1 overflow-y-auto py-4">
        {#if viewingNotice.content}
          <MarkdownPreview value={viewingNotice.content} />
        {:else}
          <p class="text-muted-foreground">{t('page.notifications.noContent')}</p>
        {/if}
      </div>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>{t('common.close')}</AlertDialog.Cancel>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/if}

<!-- Delete Confirm Dialog -->
<AlertDialog.Root bind:open={deleteConfirmOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{t('common.confirmDelete')}</AlertDialog.Title>
      <AlertDialog.Description>{t('page.notifications.confirmDelete')}</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{t('common.cancel')}</AlertDialog.Cancel>
      <AlertDialog.Action onclick={deleteNotice}>{t('common.delete')}</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<!-- Create/Edit Dialog -->
<NoticeDialog
  open={dialogOpen}
  onOpenChange={(v) => dialogOpen = v}
  notice={editingNotice}
  onSuccess={loadNotices}
/>
