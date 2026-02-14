<script lang="ts">
  import { onMount } from 'svelte';
  import * as Select from '$lib/components/ui/select';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface DictItem {
    id: string;
    group: string;
    label: string;
    value: string;
    sort: number;
    cssClass: string | null;
    listClass: string | null;
    isDefault: boolean;
    status: string | null;
  }

  interface Props {
    /** 字典分组标识，如 sys_user_sex */
    groupKey: string;
    /** 当前选中的值 */
    value?: string;
    /** 占位文本 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 触发器的 class */
    class?: string;
  }

  let {
    groupKey,
    value = $bindable(''),
    placeholder = '请选择',
    disabled = false,
    class: className = '',
  }: Props = $props();

  let items = $state<DictItem[]>([]);
  let loading = $state(true);

  // 缓存字典数据，避免重复请求
  const cache = new Map<string, DictItem[]>();

  async function loadDictItems() {
    // 检查缓存
    if (cache.has(groupKey)) {
      items = cache.get(groupKey)!;
      loading = false;
      return;
    }

    loading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemDictQuery({
        filter: { groups: [groupKey], status: '0' },
        sort: { field: 'sort', order: 'asc' },
        limit: 100,
        offset: 0,
      } as any);
      
      if (res.data?.data) {
        items = res.data.data;
        cache.set(groupKey, items);
      }
    } catch (err) {
      console.error(`Failed to load dict items for group: ${groupKey}`, err);
    } finally {
      loading = false;
    }
  }

  // 获取当前选中项的显示文本
  let displayText = $derived(() => {
    if (!value) return placeholder;
    const item = items.find(i => i.value === value);
    return item?.label || value;
  });

  // 监听 groupKey 变化重新加载
  $effect(() => {
    if (groupKey) {
      loadDictItems();
    }
  });

  onMount(() => {
    loadDictItems();
  });
</script>

<Select.Root type="single" bind:value {disabled}>
  <Select.Trigger class={className}>
    {#if loading}
      加载中...
    {:else}
      {displayText()}
    {/if}
  </Select.Trigger>
  <Select.Content>
    {#each items as item (item.id)}
      <Select.Item value={item.value}>{item.label}</Select.Item>
    {:else}
      <div class="px-2 py-1.5 text-sm text-muted-foreground">暂无数据</div>
    {/each}
  </Select.Content>
</Select.Root>
