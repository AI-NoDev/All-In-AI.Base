<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TreeSelector } from '$lib/components/ui/item-selector';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemMenuQueryFieldEnum, PostApiSystemMenuQueryOrderEnum } from '@qiyu-allinai/api';

  interface Menu {
    id: string;
    name: string;
    parentId: string | null;
    type: string;
    icon: string | null;
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
      console.log('Loading menus...');
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
      
      menus = allMenus;
      console.log('Loaded menus:', menus.length);
      
      // 加载角色已有的菜单
      // 检查 API 方法是否存在
      if (typeof api.system.getApiSystemRoleMenuRoleByRoleId === 'function') {
        console.log('Loading role menus for roleId:', roleId);
        const roleMenuRes = await api.system.getApiSystemRoleMenuRoleByRoleId({ roleId });
        console.log('Role menu response:', roleMenuRes.data);
        if (roleMenuRes.data) {
          selectedIds = Array.isArray(roleMenuRes.data) ? roleMenuRes.data : [];
        }
      } else {
        console.warn('API method getApiSystemRoleMenuRoleByRoleId not found. Please run: bun run generate:api');
        error = '请先运行 bun run generate:api 生成 API 客户端';
      }
    } catch (err) {
      console.error('Failed to load menus:', err);
      error = '加载菜单失败';
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    try {
      const api = authStore.createApi(true);
      
      if (typeof api.system.putApiSystemRoleMenuRoleByRoleId === 'function') {
        await api.system.putApiSystemRoleMenuRoleByRoleId(
          { roleId },
          { menuIds: selectedIds }
        );
        onSaved();
        open = false;
      } else {
        alert('请先运行 bun run generate:api 生成 API 客户端');
      }
    } catch (err) {
      console.error('Failed to save menus:', err);
      alert('保存失败');
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
      <Dialog.Title>分配菜单 - {roleName}</Dialog.Title>
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
          <p class="text-sm text-muted-foreground mt-2">在 apps/frontend 目录运行: bun run generate:api</p>
        </div>
      {:else}
        <TreeSelector
          items={treeItems}
          bind:selected={selectedIds}
          mode="multiple"
          searchPlaceholder="搜索菜单..."
          emptyText="暂无菜单数据"
          maxHeight="450px"
        />
      {/if}
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => open = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving || loading || !!error}>
        {saving ? '保存中...' : '保存'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
