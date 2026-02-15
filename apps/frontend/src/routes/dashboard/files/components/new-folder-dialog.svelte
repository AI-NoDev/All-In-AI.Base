<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (name: string) => void;
  }

  let { open = $bindable(false), onOpenChange, onCreate }: Props = $props();

  let folderName = $state('');

  function handleCreate() {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      folderName = '';
    }
  }

  function handleClose() {
    open = false;
    onOpenChange(false);
    folderName = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && folderName.trim()) {
      handleCreate();
    }
  }

  // 同步 open 状态变化
  function handleOpenChange(newOpen: boolean) {
    open = newOpen;
    onOpenChange(newOpen);
    if (!newOpen) {
      folderName = '';
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>新建文件夹</Dialog.Title>
    </Dialog.Header>
    <div class="py-4">
      <Input
        bind:value={folderName}
        placeholder="请输入文件夹名称"
      />
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={handleClose}>取消</Button>
      <Button onclick={handleCreate} disabled={!folderName.trim()}>创建</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
