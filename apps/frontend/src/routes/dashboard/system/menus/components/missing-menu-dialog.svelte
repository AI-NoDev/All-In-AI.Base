<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
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

  let allSelected = $derived(missingPages.length > 0 && missingPages.every(p => p.selected));
  let someSelected = $derived(missingPages.some(p => p.selected) && !allSelected);
  let selectedCount = $derived(missingPages.filter(p => p.selected).length);
  let selectedIds = $derived(new Set(missingPages.filter(p => p.selected).map(p => p.path)));

  function toggleSelect(path: string) {
    missingPages = missingPages.map(p => p.path === path ? { ...p, selected: !p.selected } : p);
  }

  function toggleSelectAll() {
    const newVal = !allSelected;
    missingPages = missingPages.map(p => ({ ...p, selected: newVal }));
  }

  const columns = [
    { key: 'title', title: '页面标题', width: 160, render: titleRender },
    { key: 'path', title: '路由路径', width: 250, render: pathRender },
    { key: 'group', title: '所属分组', width: 128, render: groupRender },
    { key: 'icon', title: '图标', width: 60, render: iconRender },
  ];

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

{#snippet titleRender({ value })}
  <span class="font-medium">{value || '-'}</span>
{/snippet}

{#snippet pathRender({ value })}
  <span class="text-muted-foreground text-sm">{value}</span>
{/snippet}

{#snippet groupRender({ row })}
  <Badge variant="outline">{row.parentName || row.group || '-'}</Badge>
{/snippet}

{#snippet iconRender({ row })}
  {#if row.icon}
    <Icon icon={row.icon} class="size-4" />
  {:else}
    -
  {/if}
{/snippet}

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>处理缺失菜单</Dialog.Title>
      <Dialog.Description>
        以下页面在菜单中不存在，选择需要创建的菜单项。
      </Dialog.Description>
    </Dialog.Header>
    <div class="max-h-[50vh] overflow-y-auto">
      <DataTable 
        {columns} 
        data={missingPages} 
        rowKey="path"
        selectable
        {selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        emptyText="没有缺失的菜单"
      />
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => open = false}>取消</Button>
      <Button onclick={handleCreate} disabled={creating || selectedCount === 0}>
        {creating ? '创建中...' : `创建选中的 ${selectedCount} 个菜单`}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
