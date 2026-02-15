<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';

  interface DeptNode {
    id: string;
    name: string;
    parentId: string | null;
    children?: DeptNode[];
    expanded?: boolean;
  }

  interface Props {
    departments: DeptNode[];
    loading: boolean;
    selectedDeptId: string | null;
    onSelectDept: (deptId: string | null) => void;
  }

  let { departments, loading, selectedDeptId, onSelectDept }: Props = $props();

  function toggleDept(dept: DeptNode, e: Event) {
    e.stopPropagation();
    dept.expanded = !dept.expanded;
  }
</script>

<div class="w-56 shrink-0 flex flex-col pr-4 border-r border-border">
  <div class="py-3 px-2">
    <h3 class="text-base font-semibold">部门列表</h3>
  </div>
  <div class="flex-1 min-h-0">
    <ScrollArea class="h-full">
      {#if loading}
        <div class="space-y-2 p-4">
          {#each [1, 2, 3, 4, 5] as _}
            <Skeleton class="h-8 w-full" />
          {/each}
        </div>
      {:else}
        <div class="p-2">
          <button
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent {selectedDeptId === null ? 'bg-accent' : ''}"
            onclick={() => onSelectDept(null)}
          >
            <Icon icon="tdesign:tree-square-dot" class="size-4" />
            <span>全部部门</span>
          </button>
          {#snippet renderTree(nodes: DeptNode[], level: number = 0)}
            {#each nodes as node}
              <div style="padding-left: {level * 12}px">
                <div
                  class="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer {selectedDeptId === node.id ? 'bg-accent' : ''}"
                  role="button"
                  tabindex="0"
                  onclick={() => onSelectDept(node.id)}
                  onkeydown={(e) => e.key === 'Enter' && onSelectDept(node.id)}
                >
                  {#if node.children && node.children.length > 0}
                    <span 
                      class="p-0.5 hover:bg-muted rounded cursor-pointer"
                      role="button"
                      tabindex="0"
                      onclick={(e) => toggleDept(node, e)}
                      onkeydown={(e) => e.key === 'Enter' && toggleDept(node, e)}
                    >
                      <Icon icon={node.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} class="size-3" />
                    </span>
                  {:else}
                    <span class="w-4"></span>
                  {/if}
                  <Icon icon="tdesign:folder" class="size-4 text-muted-foreground" />
                  <span class="truncate">{node.name}</span>
                </div>
                {#if node.expanded && node.children && node.children.length > 0}
                  {@render renderTree(node.children, level + 1)}
                {/if}
              </div>
            {/each}
          {/snippet}
          {@render renderTree(departments)}
        </div>
      {/if}
    </ScrollArea>
  </div>
</div>
