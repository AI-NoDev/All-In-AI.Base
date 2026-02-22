<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { DatePicker } from '$lib/components/common';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Role {
    id: string;
    name: string;
  }

  interface SearchForm {
    loginName: string;
    phonenumber: string;
    status: string;
    roleId: string;
    createdAtStart: string;
    createdAtEnd: string;
  }

  interface Props {
    searchForm: SearchForm;
    roles: Role[];
    onSearch: () => void;
    onReset: () => void;
  }

  let { searchForm = $bindable(), roles, onSearch, onReset }: Props = $props();

  let statusOptions = $derived([
    { value: '', label: t('common.filter.all') },
    { value: '0', label: t('common.status.enabled') },
    { value: '1', label: t('common.status.disabled') },
  ]);
</script>

<div class="py-3 border-b border-border">
  <div class="flex flex-wrap items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground whitespace-nowrap">{t('db.system.user.loginName')}</span>
      <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.loginName} />
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground whitespace-nowrap">{t('db.system.user.phonenumber')}</span>
      <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.phonenumber} />
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground whitespace-nowrap">{t('common.fields.status')}</span>
      <Select.Root type="single" bind:value={searchForm.status}>
        <Select.Trigger class="w-24 h-8">
          {statusOptions.find(o => o.value === searchForm.status)?.label || t('common.filter.all')}
        </Select.Trigger>
        <Select.Content>
          {#each statusOptions as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground whitespace-nowrap">{t('db.system.role.meta.verboseName')}</span>
      <Select.Root type="single" bind:value={searchForm.roleId}>
        <Select.Trigger class="w-32 h-8">
          {roles.find(r => r.id === searchForm.roleId)?.name || t('common.filter.all')}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="">{t('common.filter.all')}</Select.Item>
          {#each roles as role}
            <Select.Item value={role.id}>{role.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground whitespace-nowrap">{t('common.fields.createdAt')}</span>
      <DatePicker bind:value={searchForm.createdAtStart} />
      <span class="text-muted-foreground">-</span>
      <DatePicker bind:value={searchForm.createdAtEnd} />
    </div>
    <div class="flex gap-2">
      <Button size="sm" class="h-8" onclick={onSearch}>
        <Icon icon="tdesign:search" class="mr-1 size-4" />{t('common.actions.search')}
      </Button>
      <Button size="sm" variant="outline" class="h-8" onclick={onReset}>
        <Icon icon="tdesign:refresh" class="mr-1 size-4" />{t('common.actions.reset')}
      </Button>
    </div>
  </div>
</div>
