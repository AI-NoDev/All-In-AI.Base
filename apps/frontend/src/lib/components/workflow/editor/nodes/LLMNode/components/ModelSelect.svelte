<script lang="ts">
	import { ModelSelector } from '../../../components/selectors/index';
	import type { ModelConfig } from '../types';

	interface Props {
		modelConfig: ModelConfig | undefined;
		onModelChange: (config: ModelConfig | undefined) => void;
	}

	let { modelConfig, onModelChange }: Props = $props();
</script>

<ModelSelector 
	value={modelConfig}
	onValueChange={onModelChange}
	required
/>
