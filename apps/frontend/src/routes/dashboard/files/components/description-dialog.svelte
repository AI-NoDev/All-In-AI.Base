<script lang="ts">
  import * as Dialog from '@/lib/components/ui/dialog';
  import { Button } from '@/lib/components/ui/button';
  import { Textarea } from '@/lib/components/ui/textarea';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    currentDescription: string | null;
    readOnly?: boolean;
    onSave?: (description: string | null) => void;
  }

  let { 
    open = $bindable(false), 
    onOpenChange, 
    title, 
    currentDescription, 
    readOnly = false,
    onSave 
  }: Props = $props();

  let description = $state('');

  $effect(() => {
    if (open) {
      description = currentDescription || '';
    }
  });

  function handleSave() {
    if (onSave) {
      onSave(description.trim() || null);
    }
  }

  function handleClose() {
    open = false;
    onOpenChange(false);
  }

  function handleOpenChange(newOpen: boolean) {
    open = newOpen;
    onOpenChange(newOpen);
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{readOnly ? '简介' : '编辑简介'} - {title}</Dialog.Title>
    </Dialog.Header>
    <div class="py-4">
      <Textarea
        bind:value={description}
        placeholder="请输入简介..."
        rows={5}
        disabled={readOnly}
        class="resize-none"
      />
    </div>
    <Dialog.Footer>
      {#if readOnly}
        <Button onclick={handleClose}>关闭</Button>
      {:else}
        <Button variant="outline" onclick={handleClose}>取消</Button>
        <Button onclick={handleSave}>保存</Button>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
