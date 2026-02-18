<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';

  export type FileViewMode = 'all' | 'my-shared' | 'shared-with-me' | 'favorites';

  interface Props {
    activeTab: FileViewMode;
    onTabChange: (tab: FileViewMode) => void;
  }

  let { activeTab, onTabChange }: Props = $props();

  const tabs: Array<{ id: FileViewMode; label: string; icon: string }> = [
    { id: 'all', label: '全部文件', icon: 'tdesign:folder' },
    { id: 'my-shared', label: '我共享的', icon: 'tdesign:share' },
    { id: 'shared-with-me', label: '收到的共享', icon: 'tdesign:user-transmit' },
    { id: 'favorites', label: '收藏', icon: 'tdesign:star' },
  ];
</script>

<div class="flex items-center gap-1 border-b pb-2 mb-2">
  {#each tabs as tab}
    <Button
      variant={activeTab === tab.id ? 'secondary' : 'ghost'}
      size="sm"
      class="gap-1.5"
      onclick={() => onTabChange(tab.id)}
    >
      <Icon icon={tab.icon} class="size-4" />
      {tab.label}
    </Button>
  {/each}
</div>
