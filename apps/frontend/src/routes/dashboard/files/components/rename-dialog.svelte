<script lang="ts">
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName: string;
    onRename: (newName: string) => void;
  }

  let { open = $bindable(false), onOpenChange, currentName, onRename }: Props = $props();

  let newName = $state('');

  $effect(() => {
    if (open) {
      newName = currentName;
    }
  });

  function handleRename() {
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
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
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>重命名</Dialog.Title>
    </Dialog.Header>
    <div class="py-4">
      <Input
        bind:value={newName}
        placeholder="请输入新名称"
        onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleRename()}
      />
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={handleClose}>取消</Button>
      <Button onclick={handleRename} disabled={!newName.trim() || newName.trim() === currentName}>
        确定
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
