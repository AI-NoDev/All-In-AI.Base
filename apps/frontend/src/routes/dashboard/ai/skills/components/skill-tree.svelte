<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';

  interface Skill {
    id: string;
    name: string;
    parentId: string | null;
    isGroup: boolean;
    icon: string | null;
    orderNum: number;
    status: string;
    description: string | null;
    isA2a: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface SkillNode extends Skill {
    children: SkillNode[];
    expanded: boolean;
  }

  interface Props {
    skills: Skill[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (skill: Skill | null) => void;
    onCreateGroup: () => void;
    onCreateSkill: () => void;
    onEdit: (skill: Skill) => void;
    onDelete: (id: string) => void;
  }

  let { skills, loading, selectedId, onSelect, onCreateGroup, onCreateSkill, onEdit, onDelete }: Props = $props();

  function buildTree(flatSkills: Skill[]): SkillNode[] {
    const map = new Map<string, SkillNode>();
    const roots: SkillNode[] = [];
    
    flatSkills.forEach(skill => {
      map.set(skill.id, { ...skill, children: [], expanded: true });
    });
    
    flatSkills.forEach(skill => {
      const node = map.get(skill.id)!;
      if (skill.parentId && map.has(skill.parentId)) {
        map.get(skill.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    
    // Sort by orderNum
    const sortNodes = (nodes: SkillNode[]) => {
      nodes.sort((a, b) => a.orderNum - b.orderNum);
      nodes.forEach(n => sortNodes(n.children));
    };
    sortNodes(roots);
    
    return roots;
  }

  let tree = $derived(buildTree(skills));

  function toggleExpand(node: SkillNode, e: Event) {
    e.stopPropagation();
    node.expanded = !node.expanded;
  }
</script>

<Card.Root class="w-72 shrink-0 flex flex-col">
  <Card.Header class="pb-2">
    <div class="flex items-center justify-between">
      <Card.Title class="text-base">技能列表</Card.Title>
      <div class="flex gap-1">
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onCreateGroup} title="新增分组">
          <Icon icon="mdi:folder-plus" class="size-4" />
        </Button>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onCreateSkill} title="新增技能">
          <Icon icon="mdi:plus" class="size-4" />
        </Button>
      </div>
    </div>
  </Card.Header>
  <Card.Content class="p-0 flex-1 min-h-0">
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
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent {selectedId === null ? 'bg-accent' : ''}"
            onclick={() => onSelect(null)}
          >
            <Icon icon="mdi:view-list" class="size-4" />
            <span>全部技能</span>
          </button>
          
          {#snippet renderTree(nodes: SkillNode[], level: number = 0)}
            {#each nodes as node}
              <div style="padding-left: {level * 12}px">
                <div
                  class="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer {selectedId === node.id ? 'bg-accent' : ''}"
                  role="button"
                  tabindex="0"
                  onclick={() => onSelect(node)}
                  onkeydown={(e) => e.key === 'Enter' && onSelect(node)}
                >
                  {#if node.isGroup && node.children.length > 0}
                    <span
                      class="p-0.5 hover:bg-muted rounded cursor-pointer"
                      role="button"
                      tabindex="0"
                      onclick={(e) => toggleExpand(node, e)}
                      onkeydown={(e) => e.key === 'Enter' && toggleExpand(node, e)}
                    >
                      <Icon icon={node.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} class="size-3" />
                    </span>
                  {:else}
                    <span class="w-4"></span>
                  {/if}
                  <Icon icon={node.icon || (node.isGroup ? 'mdi:folder' : 'mdi:lightning-bolt')} class="size-4 shrink-0" />
                  <span class="flex-1 truncate">{node.name}</span>
                  {#if node.status === '1'}
                    <Badge variant="secondary" class="text-xs px-1">停用</Badge>
                  {/if}
                  <div class="flex gap-0.5 opacity-0 group-hover:opacity-100">
                    <button
                      class="p-0.5 hover:bg-muted rounded"
                      onclick={(e) => { e.stopPropagation(); onEdit(node); }}
                    >
                      <Icon icon="mdi:pencil" class="size-3" />
                    </button>
                    <button
                      class="p-0.5 hover:bg-muted rounded text-destructive"
                      onclick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                    >
                      <Icon icon="mdi:delete" class="size-3" />
                    </button>
                  </div>
                </div>
                {#if node.expanded && node.children.length > 0}
                  {@render renderTree(node.children, level + 1)}
                {/if}
              </div>
            {/each}
          {/snippet}
          
          {@render renderTree(tree)}
        </div>
      {/if}
    </ScrollArea>
  </Card.Content>
</Card.Root>
