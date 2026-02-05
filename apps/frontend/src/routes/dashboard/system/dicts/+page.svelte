<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface DictsPageSnapshot {
    selectedGroup: string | null;
    selectedIds: string[];
  }

  let pageState: DictsPageSnapshot = {
    selectedGroup: null,
    selectedIds: [],
  };

  let restoreCallback: ((value: DictsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<DictsPageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Table from '@/lib/components/ui/table';
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { Checkbox } from '@/lib/components/ui/checkbox';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemDictQueryFieldEnum, PostApiSystemDictQueryOrderEnum, PostApiSystemDictGroupQueryFieldEnum, PostApiSystemDictGroupQueryOrderEnum } from '@/lib/api/Api';

  interface DictGroup {
    key: string;
    name: string;
    status: string;
    remark: string | null;
  }

  interface Dict {
    id: string;
    group: string;
    label: string;
    value: string;
    sort: number;
    cssClass: string | null;
    listClass: string | null;
    isDefault: boolean;
    status: string;
    remark: string | null;
    createdAt: string;
  }

  let dictGroups = $state<DictGroup[]>([]);
  let dicts = $state<Dict[]>([]);
  let selectedGroup = $state<string | null>(pageState.selectedGroup);
  let loading = $state(true);
  let dictLoading = $state(false);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let groupDialogOpen = $state(false);
  let editingDict = $state<Dict | null>(null);
  let editingGroup = $state<DictGroup | null>(null);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);

  // Register restore callback
  restoreCallback = (value) => {
    selectedGroup = value.selectedGroup;
    selectedIds = new Set(value.selectedIds);
  };

  // Sync state changes back to module-level for snapshot
  $effect(() => {
    pageState = {
      selectedGroup,
      selectedIds: Array.from(selectedIds),
    };
  });

  let dictForm = $state({ group: '', label: '', value: '', sort: 0, cssClass: '', listClass: '', isDefault: false, status: '0', remark: '' });
  let groupForm = $state({ key: '', name: '', status: '0', remark: '' });

  const statusOptions = [{ value: '0', label: '正常' }, { value: '1', label: '停用' }];

  let allSelected = $derived(dicts.length > 0 && dicts.every(d => selectedIds.has(d.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function toggleSelectAll() { selectedIds = allSelected ? new Set() : new Set(dicts.map(d => d.id)); }
  function toggleSelect(id: string) { const s = new Set(selectedIds); s.has(id) ? s.delete(id) : s.add(id); selectedIds = s; }

  async function loadGroups() {
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemDictGroupQuery({ limit: 100, offset: 0, sort: { field: PostApiSystemDictGroupQueryFieldEnum.Key, order: PostApiSystemDictGroupQueryOrderEnum.Asc } });
      if (res.data?.data) dictGroups = res.data.data;
    } catch (err) { console.error('Failed to load dict groups:', err); }
  }

  async function loadDicts() {
    if (!selectedGroup) { dicts = []; return; }
    dictLoading = true;
    selectedIds = new Set();
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemDictQuery({ filter: { group: selectedGroup }, limit: 100, offset: 0, sort: { field: PostApiSystemDictQueryFieldEnum.Sort, order: PostApiSystemDictQueryOrderEnum.Asc } });
      if (res.data?.data) dicts = res.data.data;
    } catch (err) { console.error('Failed to load dicts:', err); }
    finally { dictLoading = false; }
  }

  function selectGroup(key: string | null) { selectedGroup = key; loadDicts(); }

  function openCreateGroup() { editingGroup = null; groupForm = { key: '', name: '', status: '0', remark: '' }; groupDialogOpen = true; }
  function openEditGroup(g: DictGroup) { editingGroup = g; groupForm = { key: g.key, name: g.name, status: g.status, remark: g.remark || '' }; groupDialogOpen = true; }

  async function handleSaveGroup() {
    if (!groupForm.key.trim() || !groupForm.name.trim()) return alert('请填写必填项');
    saving = true;
    try {
      const api = authStore.createApi(true);
      if (editingGroup) {
        await api.system.putApiSystemDictGroupByKey({ key: editingGroup.key }, { data: groupForm as any });
      } else {
        await api.system.postApiSystemDictGroup({ data: groupForm as any });
      }
      groupDialogOpen = false;
      loadGroups();
    } catch (err) { console.error('Failed to save dict group:', err); alert('保存失败'); }
    finally { saving = false; }
  }

  async function handleDeleteGroup(key: string) {
    if (!confirm('确定要删除该字典分组吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemDictGroupByKey({ key });
      if (selectedGroup === key) selectedGroup = null;
      loadGroups();
      loadDicts();
    } catch (err) { console.error('Failed to delete dict group:', err); alert('删除失败'); }
  }

  function openCreateDict() {
    if (!selectedGroup) return alert('请先选择字典分组');
    editingDict = null;
    dictForm = { group: selectedGroup, label: '', value: '', sort: 0, cssClass: '', listClass: '', isDefault: false, status: '0', remark: '' };
    dialogOpen = true;
  }

  function openEditDict(d: Dict) {
    editingDict = d;
    dictForm = { group: d.group, label: d.label, value: d.value, sort: d.sort, cssClass: d.cssClass || '', listClass: d.listClass || '', isDefault: d.isDefault, status: d.status, remark: d.remark || '' };
    dialogOpen = true;
  }

  async function handleSaveDict() {
    if (!dictForm.label.trim() || !dictForm.value.trim()) return alert('请填写必填项');
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...dictForm, cssClass: dictForm.cssClass || null, listClass: dictForm.listClass || null, remark: dictForm.remark || null };
      if (editingDict) {
        await api.system.putApiSystemDictById({ id: editingDict.id }, { data: data as any });
      } else {
        await api.system.postApiSystemDict({ data: data as any });
      }
      dialogOpen = false;
      loadDicts();
    } catch (err) { console.error('Failed to save dict:', err); alert('保存失败'); }
    finally { saving = false; }
  }

  async function handleDeleteDict(id: string) {
    if (!confirm('确定要删除该字典项吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemDictById({ id });
      loadDicts();
    } catch (err) { console.error('Failed to delete dict:', err); alert('删除失败'); }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个字典项吗？`)) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemDictById({ id })));
      selectedIds = new Set();
      loadDicts();
    } catch (err) { console.error('Failed to delete dicts:', err); alert('删除失败'); }
    finally { deleting = false; }
  }

  onMount(async () => { await loadGroups(); loading = false; });
</script>

<div class="flex flex-1 min-h-0 px-4 lg:px-6 pb-4">
  <!-- 左侧字典分组 -->
  <div class="w-64 shrink-0 flex flex-col pr-4 border-r border-border">
    <div class="py-3 px-2 flex items-center justify-between">
      <h3 class="text-base font-semibold">字典分组</h3>
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={openCreateGroup}><Icon icon="tdesign:add" class="size-4" /></Button>
    </div>
    <div class="flex-1 min-h-0">
      <ScrollArea class="h-full">
        {#if loading}
          <div class="space-y-2 p-4">{#each [1,2,3,4,5] as _}<Skeleton class="h-10 w-full" />{/each}</div>
        {:else}
          <div class="p-2">
            {#each dictGroups as group}
              <div class="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer {selectedGroup === group.key ? 'bg-accent' : ''}" role="button" tabindex="0" onclick={() => selectGroup(group.key)} onkeydown={(e) => e.key === 'Enter' && selectGroup(group.key)}>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{group.name}</div>
                  <div class="text-xs text-muted-foreground truncate">{group.key}</div>
                </div>
                <div class="flex gap-1 ml-2">
                  <button class="p-1 hover:bg-muted rounded" onclick={(e) => { e.stopPropagation(); openEditGroup(group); }}><Icon icon="tdesign:edit" class="size-3" /></button>
                  <button class="p-1 hover:bg-muted rounded text-destructive" onclick={(e) => { e.stopPropagation(); handleDeleteGroup(group.key); }}><Icon icon="tdesign:delete" class="size-3" /></button>
                </div>
              </div>
            {:else}
              <div class="text-center text-muted-foreground py-8">暂无分组</div>
            {/each}
          </div>
        {/if}
      </ScrollArea>
    </div>
  </div>

  <!-- 右侧字典项列表 -->
  <div class="flex-1 flex flex-col min-h-0 pl-4">
    <div class="py-3 flex items-center justify-between border-b border-border">
      <div class="flex gap-2">
        <Button size="sm" onclick={openCreateDict} disabled={!selectedGroup}><Icon icon="tdesign:add" class="mr-1 size-4" />新增</Button>
        {#if selectedIds.size > 0}
          <Button size="sm" variant="destructive" onclick={handleBatchDelete} disabled={deleting}>
            <Icon icon={deleting ? 'tdesign:loading' : 'tdesign:delete'} class="mr-1 size-4 {deleting ? 'animate-spin' : ''}" />删除({selectedIds.size})
          </Button>
        {/if}
      </div>
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadDicts}><Icon icon="tdesign:refresh" class="size-4" /></Button>
    </div>
    <div class="flex-1 min-h-0 flex flex-col pt-4">
      {#if !selectedGroup}
        <div class="h-48 flex items-center justify-center text-muted-foreground">请选择左侧字典分组</div>
      {:else if dictLoading}
        <div class="space-y-3">{#each [1,2,3,4,5] as _}<Skeleton class="h-12 w-full" />{/each}</div>
      {:else}
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full" orientation="both">
          <Table.Root>
            <Table.Header class="sticky top-0 bg-background z-10">
              <Table.Row>
                <Table.Head class="w-12"><Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleSelectAll} /></Table.Head>
                <Table.Head>字典标签</Table.Head>
                <Table.Head>字典键值</Table.Head>
                <Table.Head class="w-20">排序</Table.Head>
                <Table.Head class="w-20">默认</Table.Head>
                <Table.Head class="w-20">状态</Table.Head>
                <Table.Head class="w-28 text-right">操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each dicts as dict}
                <Table.Row class={selectedIds.has(dict.id) ? 'bg-muted/50' : ''}>
                  <Table.Cell><Checkbox checked={selectedIds.has(dict.id)} onCheckedChange={() => toggleSelect(dict.id)} /></Table.Cell>
                  <Table.Cell class="font-medium">{dict.label}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">{dict.value}</Table.Cell>
                  <Table.Cell>{dict.sort}</Table.Cell>
                  <Table.Cell><Badge variant={dict.isDefault ? 'default' : 'outline'}>{dict.isDefault ? '是' : '否'}</Badge></Table.Cell>
                  <Table.Cell><Badge variant={dict.status === '0' ? 'default' : 'secondary'}>{dict.status === '0' ? '正常' : '停用'}</Badge></Table.Cell>
                  <Table.Cell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEditDict(dict)}><Icon icon="tdesign:edit" class="size-4" /></Button>
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDeleteDict(dict.id)}><Icon icon="tdesign:delete" class="size-4" /></Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row><Table.Cell colspan={7} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell></Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- 字典分组弹窗 -->
<Dialog.Root bind:open={groupDialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header><Dialog.Title>{editingGroup ? '编辑字典分组' : '新增字典分组'}</Dialog.Title></Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>分组标识 *</Label>
        <Input bind:value={groupForm.key} placeholder="如 sys_user_sex" disabled={!!editingGroup} />
      </div>
      <div class="grid gap-2">
        <Label>分组名称 *</Label>
        <Input bind:value={groupForm.name} placeholder="如 用户性别" />
      </div>
      <div class="grid gap-2">
        <Label>状态</Label>
        <Select.Root type="single" bind:value={groupForm.status}>
          <Select.Trigger>{statusOptions.find(o => o.value === groupForm.status)?.label}</Select.Trigger>
          <Select.Content>{#each statusOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
        </Select.Root>
      </div>
      <div class="grid gap-2">
        <Label>备注</Label>
        <Input bind:value={groupForm.remark} placeholder="请输入备注" />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => groupDialogOpen = false}>取消</Button>
      <Button onclick={handleSaveGroup} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 字典项弹窗 -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header><Dialog.Title>{editingDict ? '编辑字典项' : '新增字典项'}</Dialog.Title></Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>字典标签 *</Label>
          <Input bind:value={dictForm.label} placeholder="如 男" />
        </div>
        <div class="grid gap-2">
          <Label>字典键值 *</Label>
          <Input bind:value={dictForm.value} placeholder="如 0" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={dictForm.sort} type="number" />
        </div>
        <div class="grid gap-2">
          <Label>状态</Label>
          <Select.Root type="single" bind:value={dictForm.status}>
            <Select.Trigger>{statusOptions.find(o => o.value === dictForm.status)?.label}</Select.Trigger>
            <Select.Content>{#each statusOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox bind:checked={dictForm.isDefault} />
        <Label>设为默认值</Label>
      </div>
      <div class="grid gap-2">
        <Label>备注</Label>
        <Input bind:value={dictForm.remark} placeholder="请输入备注" />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSaveDict} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
