<script lang="ts">
	import { VariableSelect } from '../../../components/VariableSelector/index.js';

	interface Props {
		inputVariable: string | undefined;
		onInputVariableChange: (value: string | undefined) => void;
	}

	let { inputVariable, onInputVariableChange }: Props = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium">输入变量</span>
		<span class="text-destructive text-xs">*</span>
	</div>
	<VariableSelect 
		value={inputVariable}
		onValueChange={onInputVariableChange}
		placeholder="选择输入变量"
		filterTypes={['String']}
	/>
</div>
