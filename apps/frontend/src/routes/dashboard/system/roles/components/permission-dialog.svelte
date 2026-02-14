<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TreeSelector } from '$lib/components/ui/item-selector';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface Permission {
    id: string;
    code: string;
    name: string;
    type: string;
    parentId: string | null;
  }

  interface Props {
    open: boolean;
    roleKey: string;
    roleName: string;
    onClose: () => void;
    onSaved: () => void;
  }

  let { open = $bindable(), roleKey, roleName, onClose, onSaved }: Props = $props();

  let permissions = $state<Permission[]>([]);
  let selectedCodes = $state<string[]>([]);
  let loading = $state(false);
  let saving = $state(false);

  // 转换为 TreeSelector 需要的格式
  let treeItems = $derived(permissions.map(p => ({
    id: p.code,
    label: p.name,
    parentId: permissions.find(parent => parent.id === p.parentId)?.code || null,
    description: p.code,
    icon: p.type === 'module' ? 'tdesign:folder' : p.type === 'resource' ? 'tdesign:file' : 'tdesign:control-platform',
  })));

  async function loadData() {
    loading = true;
    permissions = [];
    selectedCodes = [];
    
    try {
      const api = authStore.createApi(true);
      
      // 加载所有权限（分页加载）
      let allPermissions: Permission[] = [];
      let offset = 0;
      const limit = 100;
      
      while (true) {
        const permRes = await api.system.postApiSystemPermissionQuery({ limit, offset });
        if (permRes.data?.data) {
          allPermissions = [...allPermissions, ...permRes.data.data];
          if (permRes.data.data.length < limit) break;
          offset += limit;
        } else {
          break;
        }
      }
      
      permissions = allPermissions;
      
      // 加载角色已有的权限
      if (typeof api.system.getApiSystemCasbinRuleRoleByRoleKeyPermissions === 'function') {
        const rolePermRes = await api.system.getApiSystemCasbinRuleRoleByRoleKeyPermissions({ roleKey });
        if (rolePermRes.data) {
          selectedCodes = Array.isArray(rolePermRes.data) ? rolePermRes.data : [];
        }
      }
    } catch (err) {
      console.error('Failed to load permissions:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    try {
      const api = authStore.createApi(true);
      await api.system.putApiSystemCasbinRuleRoleByRoleKeyPermissions(
        { roleKey },
        { permissionCodes: selectedCodes }
      );
      onSaved();
      open = false;
    } catch (err) {
      console.error('Failed to save permissions:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    if (open && roleKey) {
      loadData();
    }
  });
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onClose()}>
  <Dialog.Content class="sm:max-w-lg max-h-[85vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title>分配权限 - {roleName}</Dialog.Title>
    </Dialog.Header>
    
    <div class="flex-1 min-h-0 py-4">
      {#if loading}
        <div class="space-y-2">
          {#each [1,2,3,4,5] as _}
            <Skeleton class="h-8 w-full" />
          {/each}
        </div>
      {:else}
        <TreeSelector
          items={treeItems}
          bind:selected={selectedCodes}
          mode="multiple"
          searchPlaceholder="搜索权限..."
          emptyText="暂无权限数据"
          maxHeight="450px"
        />
      {/if}
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => open = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving || loading}>
        {saving ? '保存中...' : '保存'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
