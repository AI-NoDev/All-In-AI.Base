<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ItemSelector } from '$lib/components/ui/item-selector';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemRoleQueryFieldEnum, PostApiSystemRoleQueryOrderEnum } from '@qiyu-allinai/api';

  interface Role {
    id: string;
    name: string;
    key: string;
    status: string;
  }

  interface Props {
    open: boolean;
    userId: string;
    userName: string;
    onClose: () => void;
    onSaved: () => void;
  }

  let { open = $bindable(), userId, userName, onClose, onSaved }: Props = $props();

  let roles = $state<Role[]>([]);
  let selectedIds = $state<string[]>([]);
  let loading = $state(false);
  let saving = $state(false);

  // 转换为 ItemSelector 需要的格式
  let selectorItems = $derived(roles.map(r => ({
    id: r.id,
    label: r.name,
    description: r.key,
    badge: r.key === 'admin' ? '管理员' : undefined,
    badgeVariant: r.key === 'admin' ? 'destructive' as const : undefined,
  })));

  async function loadData() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      
      // 加载所有角色
      const roleRes = await api.system.postApiSystemRoleQuery({
        limit: 100,
        offset: 0,
        filter: { status: '0' },
        sort: { field: PostApiSystemRoleQueryFieldEnum.Sort, order: PostApiSystemRoleQueryOrderEnum.Asc }
      });
      if (roleRes.data?.data) {
        roles = roleRes.data.data;
      }
      
      // 加载用户已有的角色
      const userRoleRes = await api.system.getApiSystemUserRoleUserByUserId({ userId });
      if (userRoleRes.data) {
        selectedIds = userRoleRes.data;
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    try {
      const api = authStore.createApi(true);
      await api.system.putApiSystemUserRoleUserByUserId(
        { userId },
        { roleIds: selectedIds }
      );
      onSaved();
      open = false;
    } catch (err) {
      console.error('Failed to save roles:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    if (open && userId) {
      loadData();
    }
  });
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onClose()}>
  <Dialog.Content class="sm:max-w-md max-h-[80vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title>分配角色 - {userName}</Dialog.Title>
    </Dialog.Header>
    
    <div class="flex-1 min-h-0 py-4">
      {#if loading}
        <div class="space-y-2">
          {#each [1,2,3,4] as _}
            <Skeleton class="h-10 w-full" />
          {/each}
        </div>
      {:else}
        <ItemSelector
          items={selectorItems}
          bind:selected={selectedIds}
          mode="multiple"
          searchPlaceholder="搜索角色..."
          emptyText="暂无可用角色"
          maxHeight="350px"
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
