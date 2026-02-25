<script lang="ts">
	import { ModelSelector } from '../../../components/selectors/index';
	import type { ModelConfig } from '../types';

	interface Props {
		modelConfig: ModelConfig | undefined;
		onModelChange: (value: string) => void;
	}

	let { modelConfig, onModelChange }: Props = $props();

	function handleModelChange(config: ModelConfig | undefined) {
		if (config) {
			onModelChange(`${config.provider}:${config.model}`);
		}
	}
</script>

<ModelSelector 
	value={modelConfig}
	onValueChange={handleModelChange}
	required
/>
