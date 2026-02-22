<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Icon from '@iconify/svelte';
  import { t } from '$lib/stores/i18n.svelte';

  interface Provider {
    id: string;
    name: string;
    providerType: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string | null;
  }

  interface ProviderForm {
    name: string;
    providerType: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string;
  }

  interface ProviderTypeOption {
    value: string;
    label: string;
    icon: string;
    defaultBaseUrl: string;
    requiresBaseUrl: boolean;
  }

  interface Props {
    open: boolean;
    editing: Provider | null;
    form: ProviderForm;
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), saving, onOpenChange, onSave }: Props = $props();

  const providerTypeOptions = $derived([
    { value: 'openai', label: 'OpenAI', icon: 'simple-icons:openai', defaultBaseUrl: 'https://api.openai.com/v1', requiresBaseUrl: false },
    { value: 'anthropic', label: 'Anthropic', icon: 'simple-icons:anthropic', defaultBaseUrl: 'https://api.anthropic.com', requiresBaseUrl: false },
    { value: 'google', label: 'Google', icon: 'simple-icons:google', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta', requiresBaseUrl: false },
    { value: 'azure', label: 'Azure OpenAI', icon: 'simple-icons:microsoftazure', defaultBaseUrl: '', requiresBaseUrl: true },
    { value: 'deepseek', label: 'DeepSeek', icon: 'mdi:brain', defaultBaseUrl: 'https://api.deepseek.com', requiresBaseUrl: false },
    { value: 'alibaba', label: t('page.ai.provider_typeAlibaba'), icon: 'simple-icons:alibabadotcom', defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', requiresBaseUrl: false },
    { value: 'volcengine', label: t('page.ai.provider_typeVolcengine'), icon: 'mdi:fire', defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3', requiresBaseUrl: false },
    { value: 'xai', label: 'xAI', icon: 'simple-icons:x', defaultBaseUrl: 'https://api.x.ai/v1', requiresBaseUrl: false },
    { value: 'gateway', label: 'AI Gateway', icon: 'mdi:gate', defaultBaseUrl: '', requiresBaseUrl: true },
    { value: 'openai-compatible', label: t('page.ai.provider_typeOpenaiCompatible'), icon: 'mdi:api', defaultBaseUrl: '', requiresBaseUrl: true },
  ]);

  const statusOptions = $derived([
    { value: '0', label: t('page.ai.provider_statusNormal') },
    { value: '1', label: t('page.ai.provider_statusDisabled') },
  ]);

  let selectedProviderType = $derived(providerTypeOptions.find(o => o.value === form.providerType));

  function handleProviderTypeChange(value: string) {
    form.providerType = value;
    const option = providerTypeOptions.find(o => o.value === value);
    if (option && option.defaultBaseUrl && !form.baseUrl) {
      form.baseUrl = option.defaultBaseUrl;
    }
  }
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-lg" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>{editing ? t('page.ai.provider_editTitle') : t('page.ai.provider_addTitle')}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>{t('page.ai.provider_typeRequired')}</Label>
        <Select.Root type="single" value={form.providerType} onValueChange={handleProviderTypeChange}>
          <Select.Trigger>
            <div class="flex items-center gap-2">
              {#if selectedProviderType}
                <Icon icon={selectedProviderType.icon} class="h-4 w-4" />
                {selectedProviderType.label}
              {:else}
                {t('page.ai.provider_selectType')}
              {/if}
            </div>
          </Select.Trigger>
          <Select.Content>
            {#each providerTypeOptions as opt}
              <Select.Item value={opt.value}>
                <div class="flex items-center gap-2">
                  <Icon icon={opt.icon} class="h-4 w-4" />
                  {opt.label}
                </div>
              </Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid gap-2">
        <Label>{t('page.ai.provider_nameRequired')}</Label>
        <Input bind:value={form.name} placeholder={t('page.ai.provider_namePlaceholder')} />
      </div>
      <div class="grid gap-2">
        <Label>
          {t('page.ai.provider_apiUrl')} {selectedProviderType?.requiresBaseUrl ? '*' : ''}
          {#if !selectedProviderType?.requiresBaseUrl}
            <span class="text-muted-foreground text-xs ml-1">{t('page.ai.provider_apiUrlOptional')}</span>
          {/if}
        </Label>
        <Input 
          bind:value={form.baseUrl} 
          placeholder={selectedProviderType?.defaultBaseUrl || t('page.ai.provider_apiUrlPlaceholder')} 
        />
      </div>
      <div class="grid gap-2">
        <Label>{t('page.ai.provider_apiTokenRequired')}</Label>
        <Input bind:value={form.token} type="password" placeholder={t('page.ai.provider_apiTokenPlaceholder')} />
      </div>
      <div class="grid gap-2">
        <Label>{t('page.ai.provider_status')}</Label>
        <Select.Root type="single" bind:value={form.status}>
          <Select.Trigger>{statusOptions.find(o => o.value === form.status)?.label}</Select.Trigger>
          <Select.Content>
            {#each statusOptions as opt}
              <Select.Item value={opt.value}>{opt.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid gap-2">
        <Label>{t('page.ai.provider_remark')}</Label>
        <Textarea bind:value={form.remark} placeholder={t('page.ai.provider_remarkPlaceholder')} rows={2} />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? t('common.saving') : t('common.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
