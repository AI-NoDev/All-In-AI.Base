<script lang="ts">
  import Icon from '@iconify/svelte';
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
    parseDate,
    CalendarDate,
  } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    class?: string;
    disabled?: boolean;
    onchange?: (value: string | undefined) => void;
  }

  let { value = $bindable(), placeholder, class: className, disabled = false, onchange }: Props = $props();

  const df = new DateFormatter('zh-CN', { dateStyle: 'short' });

  // 将 string (YYYY-MM-DD) 转换为 DateValue
  function stringToDateValue(str: string | undefined): DateValue | undefined {
    if (!str) return undefined;
    try {
      return parseDate(str);
    } catch {
      return undefined;
    }
  }

  // 将 DateValue 转换为 string (YYYY-MM-DD)
  function dateValueToString(dv: DateValue | undefined): string | undefined {
    if (!dv) return undefined;
    return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
  }

  let dateValue = $state<DateValue | undefined>(stringToDateValue(value));

  // 同步外部 value 变化
  $effect(() => {
    const newDateValue = stringToDateValue(value);
    if (dateValueToString(newDateValue) !== dateValueToString(dateValue)) {
      dateValue = newDateValue;
    }
  });

  // 同步内部 dateValue 变化到外部
  function handleValueChange(newValue: DateValue | undefined) {
    dateValue = newValue;
    const newStringValue = dateValueToString(newValue);
    if (newStringValue !== value) {
      value = newStringValue;
      onchange?.(newStringValue);
    }
  }
</script>

<Popover.Root>
  <Popover.Trigger {disabled}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn(
          'w-32 h-8 justify-start text-start font-normal',
          !dateValue && 'text-muted-foreground',
          className
        )}
        {disabled}
        {...props}
      >
        <Icon icon="tdesign:calendar" class="mr-2 size-4" />
        {dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : (placeholder || t('common.tips.selectDate'))}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <Calendar 
      value={dateValue}
      onValueChange={handleValueChange}
      type="single" 
      initialFocus 
      captionLayout="dropdown"
    />
  </Popover.Content>
</Popover.Root>
