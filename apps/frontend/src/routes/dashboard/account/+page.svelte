<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface FormData {
    name: string;
    email: string;
    phone: string;
  }

  interface Statistics {
    filesCount: number;
    foldersCount: number;
    sharedCount: number;
    favoritesCount: number;
  }

  interface PageSnapshot {
    form: FormData;
    stats: Statistics;
    statsLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    form: { name: '', email: '', phone: '' },
    stats: { filesCount: 0, foldersCount: 0, sharedCount: 0, favoritesCount: 0 },
    statsLoaded: false
  };
  let restoreCallback: ((value: PageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Separator } from '$lib/components/ui/separator';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Card from '$lib/components/ui/card';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { i18n, t } from '@/lib/stores/i18n.svelte';
  import { toast } from 'svelte-sonner';
  import { onMount } from 'svelte';

  let _ = $derived(i18n.version);

  let form = $state<FormData>({
    name: pageState.form.name || authStore.user?.name || '',
    email: pageState.form.email || authStore.user?.email || '',
    phone: pageState.form.phone || ''
  });

  let saving = $state(false);
  let stats = $state<Statistics>(pageState.stats);
  let loadingStats = $state(!pageState.statsLoaded);
  let snapshotRestored = $state(pageState.statsLoaded);

  restoreCallback = (value) => {
    form = value.form;
    stats = value.stats;
    snapshotRestored = value.statsLoaded;
    loadingStats = !value.statsLoaded;
  };

  $effect(() => {
    pageState = { form, stats, statsLoaded: !loadingStats };
  });

  const user = $derived(authStore.user);
  const initials = $derived(user?.name ? user.name.slice(0, 2).toUpperCase() : 'U');
  const isDisabled = $derived(user?.status === '1');
  const isSystemAdmin = $derived(authStore.isSystemAdmin());

  // 权限操作名称映射
  const actionNames: Record<string, string> = {
    view: 'page.account.perm_view',
    read: 'page.account.perm_view',  // read 和 view 同义
    add: 'page.account.perm_add',
    create: 'page.account.perm_add', // create 和 add 同义
    edit: 'page.account.perm_edit',
    update: 'page.account.perm_edit', // update 和 edit 同义
    delete: 'page.account.perm_delete',
    remove: 'page.account.perm_delete', // remove 和 delete 同义
    export: 'page.account.perm_export',
    import: 'page.account.perm_import',
    manage: 'page.account.perm_manage'
  };

  // 权限分组展示 - 按模块分组，统计各操作类型数量
  const permissionGroups = $derived(() => {
    if (!user?.permissions?.length) return [];
    
    const groups: Record<string, Record<string, number>> = {};
    user.permissions.forEach(perm => {
      const parts = perm.split(':');
      const module = parts[0] || 'other';
      const action = parts[parts.length - 1] || 'other';
      
      if (!groups[module]) groups[module] = {};
      groups[module][action] = (groups[module][action] || 0) + 1;
    });
    
    return Object.entries(groups).map(([module, actionCounts]) => ({
      module,
      actionCounts, // { view: 4, edit: 2, delete: 1 }
      totalCount: Object.values(actionCounts).reduce((sum, c) => sum + c, 0)
    }));
  });

  // 模块名称映射
  function getModuleName(module: string): string {
    const moduleNames: Record<string, string> = {
      system: 'page.account.module_system',
      knowledge: 'page.account.module_knowledge',
      ai: 'page.account.module_ai',
      im: 'page.account.module_im',
      monitor: 'page.account.module_monitor',
      other: 'page.account.module_other'
    };
    return t(moduleNames[module] || module);
  }

  // 格式化操作统计：查看 x4, 编辑 x2
  function formatActionCounts(actionCounts: Record<string, number>): string {
    return Object.entries(actionCounts)
      .map(([action, count]) => {
        const actionKey = actionNames[action];
        const actionLabel = actionKey ? t(actionKey) : action;
        return `${actionLabel} x${count}`;
      })
      .join(', ');
  }

  async function loadStatistics() {
    if (isDisabled) return;
    
    loadingStats = true;
    try {
      const api = authStore.createApi(true);
      
      // 并行加载统计数据
      const [sharedRes, favoritesRes, filesRes, foldersRes] = await Promise.all([
        api.knowledge.postApiKnowledgeShareMyShared({ limit: 1 }),
        api.knowledge.postApiKnowledgeFavoritesList({ limit: 1 }),
        api.knowledge.postApiKnowledgeNodesQuery({ filter: { type: 'file' }, limit: 1 }),
        api.knowledge.postApiKnowledgeNodesQuery({ filter: { type: 'folder' }, limit: 1 })
      ]);
      
      // API 响应结构: { data: { data: [], total: number }, message, status }
      stats = {
        filesCount: filesRes.data?.total || 0,
        foldersCount: foldersRes.data?.total || 0,
        sharedCount: sharedRes.data?.total || 0,
        favoritesCount: favoritesRes.data?.total || 0
      };
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      loadingStats = false;
    }
  }

  async function handleSave() {
    saving = true;
    try {
      const api = authStore.createApi(true);
      await api.system.putApiSystemUserId({
        id: authStore.user!.id,
        name: form.name,
        email: form.email || null,
        phonenumber: form.phone || null
      });
      await authStore.fetchCurrentUser();
      toast.success(t('common.tips_saveSuccess'));
    } catch (err) {
      toast.error(t('common.tips_saveFailed'));
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    if (authStore.user) {
      form.name = authStore.user.name || '';
      form.email = authStore.user.email || '';
    }
  });

  onMount(() => {
    if (!snapshotRestored) {
      loadStatistics();
    }
  });
</script>

<ScrollArea class="flex-1 h-full">
{#key _}
<div class="px-4 lg:px-6 py-4">
  <!-- 顶部用户卡片 -->
  <div class="mb-6">
    <Card.Root class="overflow-hidden">
      <div class="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar.Root class="size-20 ring-4 ring-background shadow-lg">
            <Avatar.Image src={user?.avatar} alt={user?.name} />
            <Avatar.Fallback class="text-2xl bg-primary text-primary-foreground">{initials}</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-semibold">{user?.name || '-'}</h2>
              {#if isSystemAdmin}
                <Badge variant="default" class="bg-amber-500 hover:bg-amber-600">
                  <Icon icon="tdesign:crown" class="size-3 mr-1" />
                  {t('page.account.adminBadge')}
                </Badge>
              {/if}
              {#if isDisabled}
                <Badge variant="destructive">
                  <Icon icon="tdesign:lock-on" class="size-3 mr-1" />
                  {t('common.status_disabled')}
                </Badge>
              {:else}
                <Badge variant="secondary" class="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  <Icon icon="tdesign:check-circle" class="size-3 mr-1" />
                  {t('common.status_normal')}
                </Badge>
              {/if}
            </div>
            <p class="text-muted-foreground">@{user?.loginName || '-'}</p>
            <p class="text-sm text-muted-foreground">{user?.email || t('page.account.noEmail')}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each user?.roles || [] as role}
              <Badge variant="outline">
                <Icon icon="tdesign:user-circle" class="size-3 mr-1" />
                {role.name}
              </Badge>
            {/each}
          </div>
        </div>
      </div>
    </Card.Root>
  </div>

  <!-- 统计卡片 - 仅正常用户显示 -->
  {#if !isDisabled}
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <Card.Root>
      <Card.Content class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-blue-500/10">
            <Icon icon="tdesign:file" class="size-5 text-blue-500" />
          </div>
          <div>
            <p class="text-2xl font-semibold">{loadingStats ? '-' : stats.filesCount}</p>
            <p class="text-xs text-muted-foreground">{t('page.account.stat_files')}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Content class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-500/10">
            <Icon icon="tdesign:folder" class="size-5 text-amber-500" />
          </div>
          <div>
            <p class="text-2xl font-semibold">{loadingStats ? '-' : stats.foldersCount}</p>
            <p class="text-xs text-muted-foreground">{t('page.account.stat_folders')}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Content class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-green-500/10">
            <Icon icon="tdesign:share" class="size-5 text-green-500" />
          </div>
          <div>
            <p class="text-2xl font-semibold">{loadingStats ? '-' : stats.sharedCount}</p>
            <p class="text-xs text-muted-foreground">{t('page.account.stat_shared')}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Content class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-rose-500/10">
            <Icon icon="tdesign:heart" class="size-5 text-rose-500" />
          </div>
          <div>
            <p class="text-2xl font-semibold">{loadingStats ? '-' : stats.favoritesCount}</p>
            <p class="text-xs text-muted-foreground">{t('page.account.stat_favorites')}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
  {/if}

  <div class="grid lg:grid-cols-2 gap-6">
    <!-- 左侧：编辑资料 -->
    <div class="space-y-6">
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Icon icon="tdesign:edit" class="size-5" />
            {t('page.account.editProfile')}
          </Card.Title>
          <Card.Description>{t('page.account.editProfileDesc')}</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div class="space-y-2">
            <Label for="name">{t('db.system.user_name')}</Label>
            <Input id="name" bind:value={form.name} placeholder={t('page.account.namePlaceholder')} />
          </div>
          <div class="space-y-2">
            <Label for="email">{t('db.system.user_email')}</Label>
            <Input id="email" type="email" bind:value={form.email} placeholder={t('page.account.emailPlaceholder')} />
          </div>
          <div class="space-y-2">
            <Label for="phone">{t('db.system.user_phonenumber')}</Label>
            <Input id="phone" bind:value={form.phone} placeholder={t('page.account.phonePlaceholder')} />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button onclick={handleSave} disabled={saving}>
            {#if saving}
              <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
            {/if}
            {t('common.save')}
          </Button>
        </Card.Footer>
      </Card.Root>

      <!-- 账户信息 -->
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Icon icon="tdesign:info-circle" class="size-5" />
            {t('page.account.accountInfo')}
          </Card.Title>
        </Card.Header>
        <Card.Content class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-muted-foreground">{t('db.system.user_loginName')}</span>
            <span class="font-mono">{user?.loginName || '-'}</span>
          </div>
          <Separator />
          <div class="flex justify-between items-center">
            <span class="text-muted-foreground">{t('db.system.user_userType')}</span>
            <Badge variant={isSystemAdmin ? 'default' : 'secondary'}>
              {isSystemAdmin ? t('page.account.systemUser') : t('page.account.normalUser')}
            </Badge>
          </div>
          <Separator />
          <div class="flex justify-between items-center">
            <span class="text-muted-foreground">{t('page.account.rolesCount')}</span>
            <span>{user?.roles?.length || 0} {t('page.account.rolesUnit')}</span>
          </div>
          <Separator />
          <div class="flex justify-between items-center">
            <span class="text-muted-foreground">{t('page.account.permissionsCount')}</span>
            <span>{isSystemAdmin ? t('page.account.allPermissions') : `${user?.permissions?.length || 0} ${t('page.account.permissionsUnit')}`}</span>
          </div>
        </Card.Content>
      </Card.Root>
    </div>

    <!-- 右侧：权限概览 -->
    <div class="space-y-6">
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Icon icon="tdesign:secured" class="size-5" />
            {t('page.account.permissionOverview')}
          </Card.Title>
          <Card.Description>{t('page.account.permissionOverviewDesc')}</Card.Description>
        </Card.Header>
        <Card.Content>
          {#if isSystemAdmin}
            <div class="flex flex-col items-center justify-center py-8 text-center">
              <Avatar.Root class="size-16 ring-4 ring-amber-500/20 mb-4">
                <Avatar.Image src={user?.avatar} alt={user?.name} />
                <Avatar.Fallback class="text-xl bg-amber-500 text-white">{initials}</Avatar.Fallback>
              </Avatar.Root>
              <h3 class="font-semibold text-lg mb-2">{t('page.account.adminTitle')}</h3>
              <p class="text-muted-foreground text-sm max-w-xs">
                {t('page.account.adminDesc')}
              </p>
            </div>
          {:else if !user?.permissions?.length}
            <div class="flex flex-col items-center justify-center py-8 text-center">
              <div class="p-4 rounded-full bg-muted mb-4">
                <Icon icon="tdesign:lock-on" class="size-10 text-muted-foreground" />
              </div>
              <h3 class="font-semibold text-lg mb-2">{t('page.account.noPermissions')}</h3>
              <p class="text-muted-foreground text-sm">
                {t('page.account.noPermissionsDesc')}
              </p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each permissionGroups() as group}
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{getModuleName(group.module)}</span>
                    <Badge variant="secondary">{group.totalCount}</Badge>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    {formatActionCounts(group.actionCounts)}
                  </p>
                </div>
              {/each}
            </div>
          {/if}
        </Card.Content>
      </Card.Root>

      <!-- 角色列表 -->
      {#if user?.roles?.length}
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Icon icon="tdesign:usergroup" class="size-5" />
            {t('page.account.myRoles')}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="space-y-3">
            {#each user.roles as role}
              <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div class="p-2 rounded-lg bg-primary/10">
                  <Icon icon="tdesign:user-circle" class="size-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="font-medium">{role.name}</p>
                  <p class="text-xs text-muted-foreground font-mono">{role.key}</p>
                </div>
              </div>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
      {/if}

      <!-- 快捷操作 -->
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Icon icon="tdesign:rocket" class="size-5" />
            {t('page.account.quickActions')}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="grid grid-cols-2 gap-3">
            <Button variant="outline" class="h-auto py-3 flex-col gap-1" onclick={() => window.location.href = '/dashboard/knowledge/my-files'}>
              <Icon icon="tdesign:folder-open" class="size-5" />
              <span class="text-xs">{t('page.account.action_myFiles')}</span>
            </Button>
            <Button variant="outline" class="h-auto py-3 flex-col gap-1" onclick={() => window.location.href = '/dashboard/knowledge/favorites'}>
              <Icon icon="tdesign:heart" class="size-5" />
              <span class="text-xs">{t('page.account.action_favorites')}</span>
            </Button>
            <Button variant="outline" class="h-auto py-3 flex-col gap-1" onclick={() => window.location.href = '/dashboard/preferences'}>
              <Icon icon="tdesign:setting" class="size-5" />
              <span class="text-xs">{t('page.account.action_preferences')}</span>
            </Button>
            <Button variant="outline" class="h-auto py-3 flex-col gap-1" onclick={() => window.location.href = '/dashboard/notifications'}>
              <Icon icon="tdesign:notification" class="size-5" />
              <span class="text-xs">{t('page.account.action_notifications')}</span>
            </Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
{/key}
</ScrollArea>
