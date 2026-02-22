<script lang="ts">
	import { browser } from '$app/environment';
	import { dev } from '$app/environment';

	// OpenAPI 文档地址（后端 Swagger）
	const apiDocsUrl = dev 
		? 'http://localhost:3030/openapi' 
		: '/openapi';
</script>

<div class="h-full w-full">
	{#if browser}
		<iframe
			src={apiDocsUrl}
			title="API 文档"
			class="h-full w-full border-0"
			sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
		></iframe>
	{/if}
</div>
