<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Provider {
    id: string;
    name: string;
  }

  interface ModelForm {
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    remark: string;
    // 能力支持
    supportTools: boolean;
    supportThinking: boolean;
    supportPrefixCompletion: boolean;
    supportFIM: boolean;
    supportJsonOutput: boolean;
    // 输入能力
    supportImageInput: boolean;
    supportVideoInput: boolean;
    supportAudioInput: boolean;
    // 输出能力
    supportImageOutput: boolean;
    supportVideoOutput: boolean;
    supportAudioOutput: boolean;
    // Token 限制
    contextWindow: number | null;
    maxInputTokens: number | null;
    maxOutputTokens: number | null;
    maxThinkingTokens: number | null;
    // 思考配置
    reasoningEffort: string | null;
    // 成本
    inputPricePerMillion: string | null;
    outputPricePerMillion: string | null;
    cacheHitPricePerMillion: string | null;
    cacheMissPricePerMillion: string | null;
  }

  interface Props {
    open: boolean;
    editing: { id: string } | null;
    form: ModelForm;
    providers: Provider[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), providers, saving, onOpenChange, onSave }: Props = $props();

  const statusOptions = $derived([
    { value: '0', label: t('page.ai.model_statusNormal') },
    { value: '1', label: t('page.ai.model_statusDisabled') },
  ]);

  const reasoningEffortOptions = $derived([
    { value: 'minimal', label: t('page.ai.model_effortMinimal') },
    { value: 'low', label: t('page.ai.model_effortLow') },
    { value: 'medium', label: t('page.ai.model_effortMedium') },
    { value: 'high', label: t('page.ai.model_effortHigh') },
  ]);

  // 当勾选支持思考时，自动设置默认的 reasoningEffort
  $effect(() => {
    if (form.supportThinking && !form.reasoningEffort) {
      form.reasoningEffort = 'high';
    }
    if (!form.supportThinking) {
      form.reasoningEffort = null;
    }
  });
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-2xl max-h-[85vh] overflow-y-auto" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>{editing ? t('page.ai.model_editTitle') : t('page.ai.model_addTitle')}</Dialog.Title>
      <Dialog.Description class="text-muted-foreground">
        {t('page.ai.model_dialogDesc')}
      </Dialog.Description>
    </Dialog.Header>
    
    <Tabs.Root value="basic" class="w-full">
      <Tabs.List class="grid w-full grid-cols-4">
        <Tabs.Trigger value="basic">{t('page.ai.model_basicInfo')}</Tabs.Trigger>
        <Tabs.Trigger value="capabilities">{t('page.ai.model_capabilities')}</Tabs.Trigger>
        <Tabs.Trigger value="tokens">{t('page.ai.model_tokenLimits')}</Tabs.Trigger>
        <Tabs.Trigger value="pricing">{t('page.ai.model_pricing')}</Tabs.Trigger>
      </Tabs.List>
      
      <!-- 基本信息 -->
      <Tabs.Content value="basic" class="space-y-4 pt-4">
        <div class="grid gap-2">
          <Label>{t('page.ai.model_provider')} *</Label>
          <Select.Root type="single" bind:value={form.providerId}>
            <Select.Trigger>{providers.find(p => p.id === form.providerId)?.name || t('page.ai.model_selectProvider')}</Select.Trigger>
            <Select.Content>
              {#each providers as p}
                <Select.Item value={p.id}>{p.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>{t('page.ai.model_name')} *</Label>
            <Input bind:value={form.name} placeholder={t('page.ai.model_namePlaceholder')} />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.ai.model_id')} *</Label>
            <Input bind:value={form.modelId} placeholder={t('page.ai.model_idPlaceholder')} />
          </div>
        </div>
        <div class="grid gap-2">
          <Label>{t('page.ai.model_status')}</Label>
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
          <Label>{t('page.ai.model_remark')}</Label>
          <Textarea bind:value={form.remark} placeholder={t('page.ai.model_remarkPlaceholder')} rows={2} />
        </div>
      </Tabs.Content>
      
      <!-- 能力支持 -->
      <Tabs.Content value="capabilities" class="space-y-4 pt-4">
        <div class="space-y-3">
          <Label class="text-sm font-medium">{t('page.ai.model_featureSupport')}</Label>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportTools} />
              <Label class="font-normal">{t('page.ai.model_toolCalling')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportThinking} />
              <Label class="font-normal">{t('page.ai.model_thinking')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportPrefixCompletion} />
              <Label class="font-normal">{t('page.ai.model_prefixCompletion')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportFIM} />
              <Label class="font-normal">{t('page.ai.model_fimCompletion')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportJsonOutput} />
              <Label class="font-normal">{t('page.ai.model_jsonOutput')}</Label>
            </div>
          </div>
        </div>
        
        <!-- 思考强度选择器（仅支持思考时显示） -->
        {#if form.supportThinking}
          <div class="space-y-3">
            <div class="grid gap-2">
              <Label>{t('page.ai.model_thinkingEffort')}</Label>
              <Select.Root type="single" bind:value={form.reasoningEffort}>
                <Select.Trigger>
                  {reasoningEffortOptions.find(o => o.value === form.reasoningEffort)?.label || t('page.ai.model_selectProvider')}
                </Select.Trigger>
                <Select.Content>
                  {#each reasoningEffortOptions as opt}
                    <Select.Item value={opt.value}>{opt.label}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <p class="text-xs text-muted-foreground">{t('page.ai.model_thinkingEffortHint')}</p>
            </div>
          </div>
        {/if}
        
        <div class="space-y-3">
          <Label class="text-sm font-medium">{t('page.ai.model_inputCapabilities')}</Label>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportImageInput} />
              <Label class="font-normal">{t('page.ai.model_image')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportVideoInput} />
              <Label class="font-normal">{t('page.ai.model_video')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportAudioInput} />
              <Label class="font-normal">{t('page.ai.model_audio')}</Label>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <Label class="text-sm font-medium">{t('page.ai.model_outputCapabilities')}</Label>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportImageOutput} />
              <Label class="font-normal">{t('page.ai.model_image')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportVideoOutput} />
              <Label class="font-normal">{t('page.ai.model_video')}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportAudioOutput} />
              <Label class="font-normal">{t('page.ai.model_audio')}</Label>
            </div>
          </div>
        </div>
      </Tabs.Content>
      
      <!-- Token限制 -->
      <Tabs.Content value="tokens" class="space-y-4 pt-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>{t('page.ai.model_contextWindow')}</Label>
            <Input bind:value={form.contextWindow} type="number" placeholder="128000" />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.ai.model_maxInputTokens')}</Label>
            <Input bind:value={form.maxInputTokens} type="number" placeholder="128000" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>{t('page.ai.model_maxOutputTokens')}</Label>
            <Input bind:value={form.maxOutputTokens} type="number" placeholder="16384" />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.ai.model_maxThinkingTokens')}</Label>
            <Input bind:value={form.maxThinkingTokens} type="number" placeholder="32768" />
          </div>
        </div>
      </Tabs.Content>
      
      <!-- 成本定价 -->
      <Tabs.Content value="pricing" class="space-y-4 pt-4">
        <p class="text-sm text-muted-foreground">{t('page.ai.model_pricingUnit')}</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>{t('page.ai.model_inputPrice')}</Label>
            <Input bind:value={form.inputPricePerMillion} type="number" step="0.0001" placeholder="15.00" />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.ai.model_outputPrice')}</Label>
            <Input bind:value={form.outputPricePerMillion} type="number" step="0.0001" placeholder="60.00" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>{t('page.ai.model_cacheHitPrice')}</Label>
            <Input bind:value={form.cacheHitPricePerMillion} type="number" step="0.0001" placeholder="1.50" />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.ai.model_cacheMissPrice')}</Label>
            <Input bind:value={form.cacheMissPricePerMillion} type="number" step="0.0001" placeholder="15.00" />
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
    
    <Dialog.Footer class="mt-4">
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? t('common.saving') : t('common.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
