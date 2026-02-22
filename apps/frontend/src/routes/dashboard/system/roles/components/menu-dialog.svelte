<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TreeSelector } from '$lib/components/ui/item-selector';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { PostApiSystemMenuQueryFieldEnum, PostApiSystemMenuQueryOrderEnum } from '@qiyu-allinai/api';

  interface Menu {
    id: string;
    name: string;
    parentId: string | null;
    type: string;
    icon: string | null;
    orderNum: number;
  }

  interface Props {
    open: boolean;
    roleId: string;
    roleName: string;
    onClose: () => void;
    onSaved: () => void;
  }

  let { open = $bindable(), roleId, roleName, onClose, onSaved }: Props = $props();

  let menus = $state<Menu[]>([]);
  let selectedIds = $state<string[]>([]);
  let loading = $state(false);
  let saving = $state(false);
  let error = $state<string | null>(null);

  const menuTypeIcons: Record<string, string> = {
    'M': 'tdesign:folder',
    'C': 'tdesign:file',
    'F': 'tdesign:control-platform',
    'L': 'tdesign:link',
  };

  // 转换为 TreeSelector 需要的格式
  let treeItems = $derived(menus.map(m => ({
    id: m.id,
    label: m.name,
    parentId: m.parentId,
    icon: m.icon || menuTypeIcons[m.type] || 'tdesign:file',
  })));

  async function loadData() {
    loading = true;
    error = null;
    menus = [];
    selectedIds = [];
    
    try {
      const api = authStore.createApi(true);
      
      // 加载所有菜单（分页加载）
      let allMenus: Menu[] = [];
      let offset = 0;
      const limit = 100;
      
      while (true) {
        const menuRes = await api.system.postApiSystemMenuQuery({
          limit,
          offset,
          sort: { field: PostApiSystemMenuQueryFieldEnum.OrderNum, order: PostApiSystemMenuQueryOrderEnum.Asc }
        });
        
        if (menuRes.data?.data) {
          allMenus = [...allMenus, ...menuRes.data.data];
          if (menuRes.data.data.length < limit) break;
          offset += limit;
        } else {
          break;
        }
      }
      
      // 按 orderNum 排序
      menus = allMenus.sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0));
      
      // 加载角色已有的菜单
      try {
        // 使用 role-menu query API 获取角色的菜单
        const roleMenuRes = await api.system.postApiSystemRoleMenuQuery({
          filter: { roleId },
          limit: 1000,
          offset: 0,
        });
        
        if (roleMenuRes.data?.data) {
          selectedIds = roleMenuRes.data.data.map((rm: { menuId: string }) => rm.menuId);
        }
      } catch (err) {
        console.warn('Failed to load role menus via query, trying direct API:', err);
        // 尝试直接 API（如果已生成）
        if (typeof (api.system as Record<string, unknown>).getApiSystemRoleMenuRoleByRoleId === 'function') {
          const roleMenuRes = await (api.system as Record<string, (...args: unknown[]) => Promise<{ data?: string[] }>>).getApiSystemRoleMenuRoleByRoleId({ roleId });
          if (roleMenuRes.data) {
            selectedIds = Array.isArray(roleMenuRes.data) ? roleMenuRes.data : [];
          }
        }
      }
    } catch (err) {
      console.error('Failed to load menus:', err);
      error = t('page.system.role.loadMenuFailed');
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    try {
      const api = authStore.createApi(true);
      
      // 先删除该角色的所有菜单关联
      const existingRes = await api.system.postApiSystemRoleMenuQuery({
        filter: { roleId },
        limit: 1000,
        offset: 0,
      });
      
      if (existingRes.data?.data) {
        // 删除现有关联
        for (const rm of existingRes.data.data) {
          await api.system.deleteApiSystemRoleMenuByRoleIdByMenuId({
            roleId: rm.roleId,
            menuId: rm.menuId,
          });
        }
      }
      
      // 批量创建新的关联
      if (selectedIds.length > 0) {
        await api.system.postApiSystemRoleMenuBatch({
          data: selectedIds.map(menuId => ({ roleId, menuId })),
        });
      }
      
      onSaved();
      open = false;
    } catch (err) {
      console.error('Failed to save menus:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    if (open && roleId) {
      loadData();
    }
  });
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onClose()}>
  <Dialog.Content class="sm:max-w-lg max-h-[85vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title>{t('page.system.role.assignMenu')} - {roleName}</Dialog.Title>
    </Dialog.Header>
    
    <div class="flex-1 min-h-0 py-4">
      {#if loading}
        <div class="space-y-2">
          {#each [1,2,3,4,5] as _}
            <Skeleton class="h-8 w-full" />
          {/each}
        </div>
      {:else if error}
        <div class="text-center text-destructive py-8">
          <p>{error}</p>
        </div>
      {:else if menus.length === 0}
        <div class="text-center text-muted-foreground py-8">
          <p>{t('page.system.role.noMenuData')}</p>
        </div>
      {:else}
        <TreeSelector
          items={treeItems}
          bind:selected={selectedIds}
          mode="multiple"
          searchPlaceholder={t('page.system.role.searchMenu')}
          emptyText={t('page.system.role.noMenuData')}
          maxHeight="450px"
        />
      {/if}
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => open = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleSave} disabled={saving || loading || !!error}>
        {saving ? t('common.tips.saving') : t('common.actions.save')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
