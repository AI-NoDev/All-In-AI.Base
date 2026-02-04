<script lang="ts">
  import * as AlertDialog from '@/lib/components/ui/dialog';
  import { Button } from '@/lib/components/ui/button';
  import { imStore } from '@/lib/stores/im.svelte';

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
      <AlertDialog.Title>解散群聊</AlertDialog.Title>
      <AlertDialog.Description>
        确定要解散该群聊吗？解散后所有成员将无法再发送消息，此操作不可撤销。
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button variant="destructive" onclick={handleDissolve}>解散</Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
