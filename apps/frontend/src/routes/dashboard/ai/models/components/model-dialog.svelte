<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';

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

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  const reasoningEffortOptions = [
    { value: 'minimal', label: '最小 (Minimal)' },
    { value: 'low', label: '低 (Low)' },
    { value: 'medium', label: '中等 (Medium)' },
    { value: 'high', label: '高 (High)' },
  ];

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
      <Dialog.Title>{editing ? '编辑模型' : '新增模型'}</Dialog.Title>
      <Dialog.Description class="text-muted-foreground">
        仅支持单模态或多模态大语言模型，不支持嵌入模型、图像生成模型等专用模型
      </Dialog.Description>
    </Dialog.Header>
    
    <Tabs.Root value="basic" class="w-full">
      <Tabs.List class="grid w-full grid-cols-4">
        <Tabs.Trigger value="basic">基本信息</Tabs.Trigger>
        <Tabs.Trigger value="capabilities">能力支持</Tabs.Trigger>
        <Tabs.Trigger value="tokens">Token限制</Tabs.Trigger>
        <Tabs.Trigger value="pricing">成本定价</Tabs.Trigger>
      </Tabs.List>
      
      <!-- 基本信息 -->
      <Tabs.Content value="basic" class="space-y-4 pt-4">
        <div class="grid gap-2">
          <Label>提供商 *</Label>
          <Select.Root type="single" bind:value={form.providerId}>
            <Select.Trigger>{providers.find(p => p.id === form.providerId)?.name || '请选择'}</Select.Trigger>
            <Select.Content>
              {#each providers as p}
                <Select.Item value={p.id}>{p.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>模型名称 *</Label>
            <Input bind:value={form.name} placeholder="如：GPT-4o" />
          </div>
          <div class="grid gap-2">
            <Label>模型ID *</Label>
            <Input bind:value={form.modelId} placeholder="如：gpt-4o" />
          </div>
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
      </Tabs.Content>
      
      <!-- 能力支持 -->
      <Tabs.Content value="capabilities" class="space-y-4 pt-4">
        <div class="space-y-3">
          <Label class="text-sm font-medium">功能支持</Label>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportTools} />
              <Label class="font-normal">工具调用 (Function Calling)</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportThinking} />
              <Label class="font-normal">思考推理 (Thinking)</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportPrefixCompletion} />
              <Label class="font-normal">前缀续写</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportFIM} />
              <Label class="font-normal">FIM补全</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportJsonOutput} />
              <Label class="font-normal">JSON结构化输出</Label>
            </div>
          </div>
        </div>
        
        <!-- 思考强度选择器（仅支持思考时显示） -->
        {#if form.supportThinking}
          <div class="space-y-3">
            <div class="grid gap-2">
              <Label>思考强度</Label>
              <Select.Root type="single" bind:value={form.reasoningEffort}>
                <Select.Trigger>
                  {reasoningEffortOptions.find(o => o.value === form.reasoningEffort)?.label || '请选择'}
                </Select.Trigger>
                <Select.Content>
                  {#each reasoningEffortOptions as opt}
                    <Select.Item value={opt.value}>{opt.label}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <p class="text-xs text-muted-foreground">控制模型思考的深度，越高越深入但响应越慢</p>
            </div>
          </div>
        {/if}
        
        <div class="space-y-3">
          <Label class="text-sm font-medium">输入能力</Label>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportImageInput} />
              <Label class="font-normal">图片</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportVideoInput} />
              <Label class="font-normal">视频</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportAudioInput} />
              <Label class="font-normal">音频</Label>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <Label class="text-sm font-medium">输出能力</Label>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportImageOutput} />
              <Label class="font-normal">图片</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportVideoOutput} />
              <Label class="font-normal">视频</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox bind:checked={form.supportAudioOutput} />
              <Label class="font-normal">音频</Label>
            </div>
          </div>
        </div>
      </Tabs.Content>
      
      <!-- Token限制 -->
      <Tabs.Content value="tokens" class="space-y-4 pt-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>上下文窗口</Label>
            <Input bind:value={form.contextWindow} type="number" placeholder="如：128000" />
          </div>
          <div class="grid gap-2">
            <Label>最大输入Token</Label>
            <Input bind:value={form.maxInputTokens} type="number" placeholder="如：128000" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>最大输出Token</Label>
            <Input bind:value={form.maxOutputTokens} type="number" placeholder="如：16384" />
          </div>
          <div class="grid gap-2">
            <Label>最大思考Token</Label>
            <Input bind:value={form.maxThinkingTokens} type="number" placeholder="如：32768" />
          </div>
        </div>
      </Tabs.Content>
      
      <!-- 成本定价 -->
      <Tabs.Content value="pricing" class="space-y-4 pt-4">
        <p class="text-sm text-muted-foreground">价格单位：元/百万Token</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>输入价格</Label>
            <Input bind:value={form.inputPricePerMillion} type="number" step="0.0001" placeholder="如：15.00" />
          </div>
          <div class="grid gap-2">
            <Label>输出价格</Label>
            <Input bind:value={form.outputPricePerMillion} type="number" step="0.0001" placeholder="如：60.00" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>缓存命中价格</Label>
            <Input bind:value={form.cacheHitPricePerMillion} type="number" step="0.0001" placeholder="如：1.50" />
          </div>
          <div class="grid gap-2">
            <Label>缓存未命中价格</Label>
            <Input bind:value={form.cacheMissPricePerMillion} type="number" step="0.0001" placeholder="如：15.00" />
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
    
    <Dialog.Footer class="mt-4">
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
