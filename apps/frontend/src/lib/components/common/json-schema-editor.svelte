<script lang="ts">
  import { JsonSchemaEditor, type JsonSchema, fromJsonSchema, toJsonSchema, createSchema } from '@qiyu-allinai/json-schema-editor';
  import { i18n } from '$lib/stores/i18n.svelte';

  interface Props {
    value?: Record<string, unknown> | null;
    onchange?: (schema: Record<string, unknown>) => void;
    class?: string;
  }

  let {
    value = $bindable(null),
    onchange,
    class: className = '',
  }: Props = $props();

  // Convert external JSON Schema to internal format
  let internalSchema = $state<JsonSchema>(createSchema());
  let isInternalUpdate = false;

  // Determine locale from i18n store
  let locale = $derived<'zh' | 'en'>(i18n.locale.startsWith('zh') ? 'zh' : 'en');

  // Initialize from value only when value changes externally
  $effect(() => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      internalSchema = fromJsonSchema(value);
    } else {
      internalSchema = createSchema();
    }
  });

  function handleChange(schema: JsonSchema) {
    isInternalUpdate = true;
    const jsonSchema = toJsonSchema(schema);
    value = jsonSchema;
    onchange?.(jsonSchema);
  }
</script>

<JsonSchemaEditor
  bind:schema={internalSchema}
  onchange={handleChange}
  {locale}
  class={className}
/>
