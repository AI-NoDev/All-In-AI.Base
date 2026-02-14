<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Table from '$lib/components/ui/table';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { pages, type PageMeta } from '@/lib/generated-pages';

  interface Menu {
    id: string;
    name: string;
    parentId: string | null;
    type: string;
    path: string | null;
  }

  interface MissingPage extends PageMeta {
    selected?: boolean;
    parentName?: string;
  }

  interface Props {
    open: boolean;
    menus: Menu[];
    onCreated?: () => void;
  }

  let { open = $bindable(), menus, onCreated }: Props = $props();

  let missingPages = $state<MissingPage[]>([]);
  let creating = $state(false);

  // 检测缺失的菜单
  function detectMissingMenus() {
    const existingPaths = new Set(menus.map(m => m.path).filter(Boolean));
    
    const visiblePages = pages.filter(p => 
      !p.hidden && 
      p.group && 
      !p.path.includes('[') && 
      p.path.startsWith('/dashboard')
    );
    
    const missing = visiblePages.filter(p => !existingPaths.has(p.path));
    
    missingPages = missing.map(p => {
      const parentDir = menus.find(m => m.type === 'M' && m.name === p.group);
      return {
        ...p,
        selected: true,
        parentName: parentDir?.name || p.group,
      };
    });
  }

  // 创建选中的缺失菜单
  async function handleCreate() {
    const selectedPages = missingPages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      alert('请选择要创建的菜单');
      return;
    }
    
    creating = true;
    try {
      const api = authStore.createApi(true);
      
      for (const page of selectedPages) {
        const parentDir = menus.find(m => m.type === 'M' && m.name === page.group);
        
        const data = {
          name: page.title || page.path.split('/').pop() || '',
          parentId: parentDir?.id || null,
          orderNum: page.order || 99,
          path: page.path,
          type: 'C',
          visible: true,
          isCache: true,
          isFrame: false,
          perms: page.permission || null,
          icon: page.icon || null,
          linkUrl: null,
          linkTarget: null,
        };
        
        await api.system.postApiSystemMenu({ data: data as Parameters<typeof api.system.postApiSystemMenu>[0]['data'] });
      }
      
      open = false;
      onCreated?.();
    } catch (err) {
      console.error('Failed to create menus:', err);
      alert('创建菜单失败');
    } finally {
      creating = false;
    }
  }

  function toggleSelectAll(checked: boolean) {
    missingPages = missingPages.map(p => ({ ...p, selected: checked }));
  }

  let allSelected = $derived(missingPages.length > 0 && missingPages.every(p => p.selected));
  let someSelected = $derived(missingPages.some(p => p.selected) && !allSelected);
  let selectedCount = $derived(missingPages.filter(p => p.selected).length);

  // 当对话框打开时检测缺失菜单
  $effect(() => {
    if (open) {
      detectMissingMenus();
    }
  });

  export function getMissingCount(): number {
    detectMissingMenus();
    return missingPages.length;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>处理缺失菜单</Dialog.Title>
      <Dialog.Description>
        以下页面在菜单中不存在，选择需要创建的菜单项。
      </Dialog.Description>
    </Dialog.Header>
    <div class="max-h-[50vh] overflow-y-auto">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-10">
              <Checkbox 
                checked={allSelected} 
                indeterminate={someSelected}
                onCheckedChange={(checked) => toggleSelectAll(!!checked)} 
              />
            </Table.Head>
            <Table.Head>页面标题</Table.Head>
            <Table.Head>路由路径</Table.Head>
            <Table.Head>所属分组</Table.Head>
            <Table.Head>图标</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each missingPages as page, i}
            <Table.Row>
              <Table.Cell>
                <Checkbox bind:checked={missingPages[i].selected} />
              </Table.Cell>
              <Table.Cell class="font-medium">{page.title || '-'}</Table.Cell>
              <Table.Cell class="text-muted-foreground text-sm">{page.path}</Table.Cell>
              <Table.Cell>
                <Badge variant="outline">{page.parentName || page.group || '-'}</Badge>
              </Table.Cell>
              <Table.Cell>
                {#if page.icon}
                  <Icon icon={page.icon} class="size-4" />
                {:else}
                  -
                {/if}
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell colspan={5} class="h-24 text-center text-muted-foreground">
                没有缺失的菜单
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => open = false}>取消</Button>
      <Button onclick={handleCreate} disabled={creating || selectedCount === 0}>
        {creating ? '创建中...' : `创建选中的 ${selectedCount} 个菜单`}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
