<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { imStore } from '@/lib/stores/im.svelte';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Props {
    open: boolean;
    conversationId: string | null;
    onOpenChange: (open: boolean) => void;
  }

  let { open = $bindable(), conversationId, onOpenChange }: Props = $props();

  async function handleDissolve() {
    if (!conversationId) return;
    try {
      await imStore.dissolveGroup(conversationId);
      onOpenChange(false);
    } catch (e) {
      console.error('Failed to dissolve group:', e);
    }
  }
</script>

<AlertDialog.Root bind:open={open}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{t('page.im.dissolveGroup')}</AlertDialog.Title>
      <AlertDialog.Description>
        {t('page.im.dissolveGroupConfirm')}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
      <Button variant="destructive" onclick={handleDissolve}>{t('page.im.dissolveGroup')}</Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
