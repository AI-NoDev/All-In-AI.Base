<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { SkillTree, SkillDetail, SkillDialog } from './components';

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

  interface SkillForm {
    name: string;
    parentId: string;
    isGroup: boolean;
    icon: string;
    orderNum: number;
    status: string;
    description: string;
    isA2a: boolean;
  }

  let skills = $state<Skill[]>([]);
  let loading = $state(true);
  let selectedSkill = $state<Skill | null>(null);

  // Dialog state
  let dialogOpen = $state(false);
  let editingSkill = $state<Skill | null>(null);
  let skillForm = $state<SkillForm>({
    name: '',
    parentId: '',
    isGroup: false,
    icon: '',
    orderNum: 1,
    status: '0',
    description: '',
    isA2a: false,
  });
  let saving = $state(false);

  let groups = $derived(skills.filter(s => s.isGroup));

  async function loadSkills() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiSkillQuery({ limit: 100, offset: 0 });
      if (res.data?.data) {
        skills = (res.data.data as Skill[]).sort((a, b) => a.orderNum - b.orderNum);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    }
  }

  function handleSelect(skill: Skill | null) {
    if (skill) {
      selectedSkill = skills.find(s => s.id === skill.id) || null;
    } else {
      selectedSkill = null;
    }
  }

  function openCreateGroup() {
    editingSkill = null;
    skillForm = {
      name: '',
      parentId: '',
      isGroup: true,
      icon: 'mdi:folder',
      orderNum: skills.filter(s => s.isGroup).length + 1,
      status: '0',
      description: '',
      isA2a: false,
    };
    dialogOpen = true;
  }

  function openCreateSkill() {
    editingSkill = null;
    skillForm = {
      name: '',
      parentId: selectedSkill?.isGroup ? selectedSkill.id : (selectedSkill?.parentId || ''),
      isGroup: false,
      icon: 'mdi:lightning-bolt',
      orderNum: skills.filter(s => !s.isGroup).length + 1,
      status: '0',
      description: '',
      isA2a: false,
    };
    dialogOpen = true;
  }

  function openEditSkill(skill: Skill) {
    editingSkill = skill;
    skillForm = {
      name: skill.name,
      parentId: skill.parentId || '',
      isGroup: skill.isGroup,
      icon: skill.icon || '',
      orderNum: skill.orderNum,
      status: skill.status,
      description: skill.description || '',
      isA2a: skill.isA2a,
    };
    dialogOpen = true;
  }

  async function handleSaveSkill() {
    if (!skillForm.name.trim()) {
      alert('请输入名称');
      return;
    }
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = {
        name: skillForm.name,
        parentId: skillForm.parentId || null,
        isGroup: skillForm.isGroup,
        icon: skillForm.icon || null,
        orderNum: skillForm.orderNum,
        status: skillForm.status,
        description: skillForm.description || null,
        isA2a: skillForm.isA2a,
      };
      if (editingSkill) {
        await api.ai.putApiAiSkillById({ id: editingSkill.id }, { data } as Parameters<typeof api.ai.putApiAiSkillById>[1]);
      } else {
        await api.ai.postApiAiSkill({ data } as Parameters<typeof api.ai.postApiAiSkill>[0]);
      }
      dialogOpen = false;
      await loadSkills();
      if (editingSkill && selectedSkill?.id === editingSkill.id) {
        selectedSkill = skills.find(s => s.id === editingSkill!.id) || null;
      }
    } catch (err) {
      console.error('Failed to save skill:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDeleteSkill(id: string) {
    const skillToDelete = skills.find(s => s.id === id);
    if (!skillToDelete) return;
    
    // Check if it's a group with children
    const hasChildren = skills.some(s => s.parentId === id);
    if (hasChildren) {
      alert('该分组下还有子项，请先删除子项');
      return;
    }
    
    if (!confirm(`确定要删除${skillToDelete.isGroup ? '分组' : '技能'}"${skillToDelete.name}"吗？`)) return;
    
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiSkillById({ id });
      if (selectedSkill?.id === id) selectedSkill = null;
      await loadSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
      alert('删除失败');
    }
  }

  function handleEditFromDetail() {
    if (selectedSkill) openEditSkill(selectedSkill);
  }

  function handleDeleteFromDetail() {
    if (selectedSkill) handleDeleteSkill(selectedSkill.id);
  }

  onMount(async () => {
    await loadSkills();
    loading = false;
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <SkillTree
    {skills}
    {loading}
    selectedId={selectedSkill?.id || null}
    onSelect={handleSelect}
    onCreateGroup={openCreateGroup}
    onCreateSkill={openCreateSkill}
    onEdit={openEditSkill}
    onDelete={handleDeleteSkill}
  />
  <SkillDetail
    skill={selectedSkill}
    onEdit={handleEditFromDetail}
    onDelete={handleDeleteFromDetail}
  />
</div>

<SkillDialog
  open={dialogOpen}
  editing={editingSkill}
  bind:form={skillForm}
  {groups}
  {saving}
  onOpenChange={(v) => dialogOpen = v}
  onSave={handleSaveSkill}
/>
