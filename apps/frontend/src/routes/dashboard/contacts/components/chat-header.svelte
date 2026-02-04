<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as DropdownMenu from '@/lib/components/ui/dropdown-menu';
  import { Button } from '@/lib/components/ui/button';
  import { Avatar, AvatarFallback, AvatarImage } from '@/lib/components/ui/avatar';
  import { Badge } from '@/lib/components/ui/badge';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im.svelte';

  interface Props {
    onDissolve: (convId: string) => void;
  }

  let { onDissolve }: Props = $props();

  function getConversationName(conv: { name: string | null; type: string }): string {
    if (conv.name) return conv.name;
    if (conv.type === '1') return '私聊';
    return '群聊';
  }

  function getInitials(name: string | null): string {
    if (!name) return '?';
    return name.slice(0, 2);
  }

  function isGroupOwner(conv: { type: string; ownerId: string | null }): boolean {
    return conv.type === '2' && conv.ownerId === authStore.user?.id;
  }

  function isGroupDissolved(conv: { status: string | null }): boolean {
    return conv.status === '1';
  }

  async function handleHideConversation(convId: string) {
    await imStore.hideConversation(convId);
  }
</script>

{#if imStore.selectedConversation}
  <div class="p-4 border-b flex items-center justify-between">
    <div class="flex items-center gap-3">
      <Avatar class="size-10">
        <AvatarImage src={imStore.selectedConversation.avatar || ''} alt={getConversationName(imStore.selectedConversation)} />
        <AvatarFallback class={imStore.selectedConversation.type === '2' ? 'bg-blue-100 text-blue-600' : ''}>
          {#if imStore.selectedConversation.type === '2'}
            <Icon icon="tdesign:usergroup" class="size-5" />
          {:else}
            {getInitials(imStore.selectedConversation.name)}
          {/if}
        </AvatarFallback>
      </Avatar>
      <div>
        <div class="font-medium flex items-center gap-2">
          {getConversationName(imStore.selectedConversation)}
          {#if isGroupDissolved(imStore.selectedConversation)}
            <Badge variant="destructive" class="text-xs">已解散</Badge>
          {/if}
        </div>
        <div class="text-xs text-muted-foreground">
          {#if imStore.selectedConversation.type === '2'}
            {imStore.selectedConversation.memberCount} 人
          {:else}
            私聊
          {/if}
        </div>
      </div>
    </div>
    <div class="flex gap-1">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0">
            <Icon icon="tdesign:more" class="size-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onclick={() => handleHideConversation(imStore.selectedConversation!.id)}>
            <Icon icon="tdesign:delete" class="mr-2 size-4" />
            隐藏会话
          </DropdownMenu.Item>
          {#if imStore.selectedConversation.type === '2' && isGroupOwner(imStore.selectedConversation) && !isGroupDissolved(imStore.selectedConversation)}
            <DropdownMenu.Separator />
            <DropdownMenu.Item 
              class="text-destructive focus:text-destructive"
              onclick={() => onDissolve(imStore.selectedConversation!.id)}
            >
              <Icon icon="tdesign:poweroff" class="mr-2 size-4" />
              解散群聊
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
{/if}
