<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderName: string;
    currentIcon: string | null;
    currentColor: string | null;
    onSave: (icon: string | null, color: string | null) => void;
  }

  let { 
    open = $bindable(false), 
    onOpenChange, 
    folderName,
    currentIcon, 
    currentColor,
    onSave 
  }: Props = $props();

  let icon = $state('');
  let color = $state('');

  const presetIcons = [
    'tdesign:folder',
    'tdesign:folder-open',
    'tdesign:folder-add',
    'tdesign:folder-zip',
    'tdesign:folder-locked',
    'tdesign:folder-setting',
    'tdesign:star',
    'tdesign:heart',
    'tdesign:bookmark',
    'tdesign:flag',
    'tdesign:home',
    'tdesign:user',
  ];

  const presetColors = [
    '#f59e0b', // amber
    '#ef4444', // red
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#6366f1', // indigo
    '#84cc16', // lime
  ];

  $effect(() => {
    if (open) {
      icon = currentIcon || '';
      color = currentColor || '#f59e0b';
    }
  });

  function handleSave() {
    onSave(icon || null, color || null);
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
      <Dialog.Title>修改文件夹样式 - {folderName}</Dialog.Title>
    </Dialog.Header>
    <div class="py-4 space-y-4">
      <div class="flex items-center justify-center p-4 bg-muted rounded-lg">
        <Icon 
          icon={icon || 'tdesign:folder'} 
          class="size-16" 
          style="color: {color || '#f59e0b'}"
        />
      </div>

      <div class="space-y-2">
        <Label>图标</Label>
        <div class="flex flex-wrap gap-2">
          {#each presetIcons as presetIcon}
            <button
              type="button"
              class="p-2 rounded-md border hover:bg-muted transition-colors {icon === presetIcon ? 'border-primary bg-muted' : 'border-transparent'}"
              onclick={() => icon = presetIcon}
            >
              <Icon icon={presetIcon} class="size-5" style="color: {color || '#f59e0b'}" />
            </button>
          {/each}
        </div>
        <Input
          bind:value={icon}
          placeholder="自定义图标 (如 tdesign:folder)"
          class="mt-2"
        />
      </div>

      <div class="space-y-2">
        <Label>颜色</Label>
        <div class="flex flex-wrap gap-2">
          {#each presetColors as presetColor}
            <button
              type="button"
              class="size-8 rounded-full border-2 transition-all {color === presetColor ? 'border-foreground scale-110' : 'border-transparent'}"
              style="background-color: {presetColor}"
              onclick={() => color = presetColor}
            />
          {/each}
        </div>
        <div class="flex items-center gap-2 mt-2">
          <input
            type="color"
            bind:value={color}
            class="size-8 rounded cursor-pointer"
          />
          <Input
            bind:value={color}
            placeholder="#f59e0b"
            class="flex-1"
          />
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={handleClose}>取消</Button>
      <Button onclick={handleSave}>保存</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
