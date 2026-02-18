<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Icon from '@iconify/svelte';

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

  const providerTypeOptions: ProviderTypeOption[] = [
    { value: 'openai', label: 'OpenAI', icon: 'simple-icons:openai', defaultBaseUrl: 'https://api.openai.com/v1', requiresBaseUrl: false },
    { value: 'anthropic', label: 'Anthropic', icon: 'simple-icons:anthropic', defaultBaseUrl: 'https://api.anthropic.com', requiresBaseUrl: false },
    { value: 'google', label: 'Google', icon: 'simple-icons:google', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta', requiresBaseUrl: false },
    { value: 'azure', label: 'Azure OpenAI', icon: 'simple-icons:microsoftazure', defaultBaseUrl: '', requiresBaseUrl: true },
    { value: 'deepseek', label: 'DeepSeek', icon: 'mdi:brain', defaultBaseUrl: 'https://api.deepseek.com', requiresBaseUrl: false },
    { value: 'alibaba', label: '阿里云百炼', icon: 'simple-icons:alibabadotcom', defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', requiresBaseUrl: false },
    { value: 'volcengine', label: '火山引擎', icon: 'mdi:fire', defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3', requiresBaseUrl: false },
    { value: 'xai', label: 'xAI', icon: 'simple-icons:x', defaultBaseUrl: 'https://api.x.ai/v1', requiresBaseUrl: false },
    { value: 'gateway', label: 'AI Gateway', icon: 'mdi:gate', defaultBaseUrl: '', requiresBaseUrl: true },
    { value: 'openai-compatible', label: 'OpenAI 兼容', icon: 'mdi:api', defaultBaseUrl: '', requiresBaseUrl: true },
  ];

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

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
      <Dialog.Title>{editing ? '编辑提供商' : '新增提供商'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>服务商类型 *</Label>
        <Select.Root type="single" value={form.providerType} onValueChange={handleProviderTypeChange}>
          <Select.Trigger>
            <div class="flex items-center gap-2">
              {#if selectedProviderType}
                <Icon icon={selectedProviderType.icon} class="h-4 w-4" />
                {selectedProviderType.label}
              {:else}
                请选择服务商类型
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
        <Label>名称 *</Label>
        <Input bind:value={form.name} placeholder="如：OpenAI、Claude" />
      </div>
      <div class="grid gap-2">
        <Label>
          API 地址 {selectedProviderType?.requiresBaseUrl ? '*' : ''}
          {#if !selectedProviderType?.requiresBaseUrl}
            <span class="text-muted-foreground text-xs ml-1">(可选，留空使用默认地址)</span>
          {/if}
        </Label>
        <Input 
          bind:value={form.baseUrl} 
          placeholder={selectedProviderType?.defaultBaseUrl || '请输入 API 地址'} 
        />
      </div>
      <div class="grid gap-2">
        <Label>API Token *</Label>
        <Input bind:value={form.token} type="password" placeholder="请输入 API Token" />
      </div>
      <div class="grid gap-2">
        <Label>状态</Label>
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
        <Label>备注</Label>
        <Textarea bind:value={form.remark} placeholder="请输入备注" rows={2} />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
