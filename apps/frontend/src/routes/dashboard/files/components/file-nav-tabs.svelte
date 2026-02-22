<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/stores/i18n.svelte';

  export type FileViewMode = 'all' | 'my-shared' | 'shared-with-me' | 'favorites';

  interface Props {
    activeTab: FileViewMode;
    onTabChange: (tab: FileViewMode) => void;
  }

  let { activeTab, onTabChange }: Props = $props();

  let tabs = $derived([
    { id: 'all' as FileViewMode, label: t('page.knowledge.allFiles'), icon: 'tdesign:folder' },
    { id: 'my-shared' as FileViewMode, label: t('page.knowledge.mySharedTab'), icon: 'tdesign:share' },
    { id: 'shared-with-me' as FileViewMode, label: t('page.knowledge.sharedWithMeTab'), icon: 'tdesign:user-transmit' },
    { id: 'favorites' as FileViewMode, label: t('page.knowledge.favoritesTab'), icon: 'tdesign:star' },
  ]);
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
