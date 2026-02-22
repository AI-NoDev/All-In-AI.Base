<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
  import { Badge } from '$lib/components/ui/badge';
  import MarkdownEditor from '$lib/components/common/markdown-editor.svelte';
  import UserSelectorSheet from './user-selector-sheet.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { toast } from 'svelte-sonner';

  interface NoticeData {
    id?: string;
    title: string;
    type: string;
    content: string;
    status?: string;
    targetType: string;
    targetUserIds: string[];
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notice?: NoticeData | null;
    onSuccess: () => void;
  }

  let { open, onOpenChange, notice = null, onSuccess }: Props = $props();

  const NOTICE_TYPE = { NOTICE: '1', ANNOUNCEMENT: '2' };
  const NOTICE_TARGET_TYPE = { ALL: 'all', CUSTOM: 'custom' };
  const NOTICE_STATUS = { DRAFT: '0', PUBLISHED: '1' };

  // Form state
  let form = $state<NoticeData>({
    title: '',
    type: NOTICE_TYPE.NOTICE,
    content: '',
    targetType: NOTICE_TARGET_TYPE.ALL,
    targetUserIds: [],
  });
  let submitting = $state(false);
  let userSelectorOpen = $state(false);

  const api = authStore.createApi(true);

  const isEdit = $derived(!!notice?.id);
  const dialogTitle = $derived(isEdit ? t('page.notifications.editNotice') : t('page.notifications.createNotice'));

  const typeOptions = $derived([
    { value: NOTICE_TYPE.NOTICE, label: t('page.notifications.typeNotice') },
    { value: NOTICE_TYPE.ANNOUNCEMENT, label: t('page.notifications.typeAnnouncement') },
  ]);

  function resetForm() {
    form = {
      title: '',
      type: NOTICE_TYPE.NOTICE,
      content: '',
      targetType: NOTICE_TARGET_TYPE.ALL,
      targetUserIds: [],
    };
  }

  async function handleSubmit(publish = false) {
    if (!form.title.trim()) {
      toast.error(t('validation.required'));
      return;
    }

    submitting = true;
    try {
      const data = {
        title: form.title,
        type: form.type,
        content: form.content,
        targetType: form.targetType,
        targetUserIds: form.targetType === NOTICE_TARGET_TYPE.CUSTOM ? form.targetUserIds : null,
        status: publish ? NOTICE_STATUS.PUBLISHED : NOTICE_STATUS.DRAFT,
      };

      if (isEdit && notice?.id) {
        await api.system.putApiSystemNoticeById({ id: notice.id, data });
        if (publish && notice.status === NOTICE_STATUS.DRAFT) {
          await api.system.postApiSystemNoticeByIdPublish({ id: notice.id });
        }
        toast.success(t('page.notifications.updateSuccess'));
      } else {
        const res = await api.system.postApiSystemNotice({ data });
        if (publish && res.data?.id) {
          await api.system.postApiSystemNoticeByIdPublish({ id: res.data.id });
        }
        toast.success(t('page.notifications.createSuccess'));
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to save notice:', err);
      toast.error(t('error.network.error'));
    } finally {
      submitting = false;
    }
  }

  function handleUserSelect(userIds: string[]) {
    form.targetUserIds = userIds;
  }

  $effect(() => {
    if (open) {
      if (notice) {
        form = {
          id: notice.id,
          title: notice.title,
          type: notice.type,
          content: notice.content,
          targetType: notice.targetType,
          targetUserIds: notice.targetUserIds || [],
        };
      } else {
        resetForm();
      }
    }
  });
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="max-w-3xl max-h-[90vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title>{dialogTitle}</Dialog.Title>
    </Dialog.Header>

    <div class="flex-1 overflow-y-auto space-y-4 py-4">
      <!-- Title -->
      <div class="space-y-2">
        <Label for="title">{t('page.notifications.noticeTitle')}</Label>
        <Input
          id="title"
          bind:value={form.title}
          placeholder={t('page.notifications.noticeTitle')}
          maxlength={100}
        />
      </div>

      <!-- Type -->
      <div class="space-y-2">
        <Label>{t('page.notifications.noticeType')}</Label>
        <Select.Root type="single" value={form.type} onValueChange={(v) => form.type = v || NOTICE_TYPE.NOTICE}>
          <Select.Trigger class="w-48">
            {typeOptions.find(o => o.value === form.type)?.label || t('common.select')}
          </Select.Trigger>
          <Select.Content>
            {#each typeOptions as opt}
              <Select.Item value={opt.value}>{opt.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- Target Type -->
      <div class="space-y-2">
        <Label>{t('page.notifications.targetType')}</Label>
        <RadioGroup value={form.targetType} onValueChange={(v) => form.targetType = v}>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <RadioGroupItem value={NOTICE_TARGET_TYPE.ALL} id="target-all" />
              <Label for="target-all" class="font-normal cursor-pointer">{t('page.notifications.targetAll')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem value={NOTICE_TARGET_TYPE.CUSTOM} id="target-custom" />
              <Label for="target-custom" class="font-normal cursor-pointer">{t('page.notifications.targetCustom')}</Label>
            </div>
          </div>
        </RadioGroup>

        {#if form.targetType === NOTICE_TARGET_TYPE.CUSTOM}
          <div class="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" onclick={() => userSelectorOpen = true}>
              <Icon icon="tdesign:user-add" class="mr-2 size-4" />
              {t('page.notifications.selectUsers')}
            </Button>
            {#if form.targetUserIds.length > 0}
              <Badge variant="secondary">
                {t('page.notifications.selectedUsers').replace('${count}', String(form.targetUserIds.length))}
              </Badge>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Content -->
      <div class="space-y-2">
        <Label>{t('page.notifications.noticeContent')}</Label>
        <MarkdownEditor bind:value={form.content} height={250} />
      </div>
    </div>

    <Dialog.Footer class="gap-2">
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={submitting}>
        {t('common.cancel')}
      </Button>
      <Button variant="secondary" onclick={() => handleSubmit(false)} disabled={submitting}>
        {#if submitting}
          <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('page.notifications.saveAsDraft')}
      </Button>
      <Button onclick={() => handleSubmit(true)} disabled={submitting}>
        {#if submitting}
          <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('page.notifications.publish')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<UserSelectorSheet
  open={userSelectorOpen}
  onOpenChange={(v) => userSelectorOpen = v}
  selectedUserIds={form.targetUserIds}
  onConfirm={handleUserSelect}
/>
