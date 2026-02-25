<script lang="ts">
	import type { RootSchema } from '../schema-types';
	import { ZodVisualEditor } from '@qiyu-allinai/json-schema-editor';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		open: boolean;
		schema: RootSchema;
		onOpenChange: (open: boolean) => void;
		onSchemaChange: (schema: RootSchema) => void;
	}

	let { open = $bindable(), schema, onOpenChange, onSchemaChange }: Props = $props();
</script>

<Dialog.Root bind:open onOpenChange={onOpenChange}>
	<Dialog.Content class="max-w-[1200px] w-[95vw] h-[85vh] flex flex-col p-0">
		<Dialog.Header class="px-6 pt-6 pb-4">
			<Dialog.Title>配置结构化输出</Dialog.Title>
			<Dialog.Description>
				定义 LLM 输出的 JSON Schema 结构
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex-1 overflow-hidden px-6 pb-6">
			<ZodVisualEditor 
				schema={schema}
				onSchemaChange={onSchemaChange}
				height="100%"
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
