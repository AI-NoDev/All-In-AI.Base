<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';

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

  interface Props {
    skill: Skill | null;
    onEdit: () => void;
    onDelete: () => void;
  }

  let { skill, onEdit, onDelete }: Props = $props();
</script>

<Card.Root class="flex-1 flex flex-col min-h-0">
  <Card.Content class="flex-1 flex items-center justify-center">
    {#if !skill}
      <div class="text-center text-muted-foreground">
        <Icon icon="mdi:lightning-bolt" class="size-16 mx-auto mb-4 opacity-20" />
        <p>选择左侧技能查看详情</p>
      </div>
    {:else}
      <div class="w-full max-w-2xl mx-auto p-6">
        <div class="flex items-start gap-4 mb-6">
          <div class="size-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon icon={skill.icon || (skill.isGroup ? 'mdi:folder' : 'mdi:lightning-bolt')} class="size-8 text-primary" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-semibold">{skill.name}</h2>
              <Badge variant={skill.isGroup ? 'outline' : 'default'}>
                {skill.isGroup ? '分组' : '技能'}
              </Badge>
              <Badge variant={skill.status === '0' ? 'default' : 'secondary'}>
                {skill.status === '0' ? '正常' : '停用'}
              </Badge>
            </div>
            <p class="text-muted-foreground">{skill.description || '暂无描述'}</p>
          </div>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" onclick={onEdit}>
              <Icon icon="mdi:pencil" class="mr-1 size-4" />编辑
            </Button>
            <Button size="sm" variant="destructive" onclick={onDelete}>
              <Icon icon="mdi:delete" class="mr-1 size-4" />删除
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-muted/50">
            <div class="text-sm text-muted-foreground mb-1">排序</div>
            <div class="font-medium">{skill.orderNum}</div>
          </div>
          <div class="p-4 rounded-lg bg-muted/50">
            <div class="text-sm text-muted-foreground mb-1">A2A 协议</div>
            <div class="font-medium">{skill.isA2a ? '是' : '否'}</div>
          </div>
          <div class="p-4 rounded-lg bg-muted/50">
            <div class="text-sm text-muted-foreground mb-1">创建时间</div>
            <div class="font-medium">{new Date(skill.createdAt).toLocaleString('zh-CN')}</div>
          </div>
          <div class="p-4 rounded-lg bg-muted/50">
            <div class="text-sm text-muted-foreground mb-1">更新时间</div>
            <div class="font-medium">{new Date(skill.updatedAt).toLocaleString('zh-CN')}</div>
          </div>
        </div>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
