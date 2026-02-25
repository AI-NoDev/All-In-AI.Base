<script lang="ts">
  import '../app.css';
  import { JsonSchemaEditor, toJsonSchema, createSchema, type JsonSchema } from '$lib/index.js';

  let schema = $state<JsonSchema>(createSchema());
  let jsonOutput = $derived(JSON.stringify(toJsonSchema(schema), null, 2));
  let locale = $state<'zh' | 'en'>('zh');
</script>

<div class="demo-container">
  <header class="demo-header">
    <h1>JSON Schema Editor</h1>
    <p>A visual editor for building JSON schemas (AJV compatible)</p>
    <div class="locale-switch">
      <button
        class="locale-btn {locale === 'zh' ? 'active' : ''}"
        onclick={() => locale = 'zh'}
      >
        中文
      </button>
      <button
        class="locale-btn {locale === 'en' ? 'active' : ''}"
        onclick={() => locale = 'en'}
      >
        English
      </button>
    </div>
  </header>

  <div class="demo-content">
    <div class="editor-panel">
      <h2>{locale === 'zh' ? '可视化编辑器' : 'Visual Editor'}</h2>
      <JsonSchemaEditor
        bind:schema
        {locale}
        onchange={(s) => console.log('Schema changed:', s)}
      />
    </div>

    <div class="output-panel">
      <h2>JSON Schema Output</h2>
      <pre class="json-output"><code>{jsonOutput}</code></pre>
    </div>
  </div>
</div>

<style>
  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .demo-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .demo-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .demo-header p {
    color: hsl(var(--muted-foreground));
    margin-bottom: 16px;
  }

  .locale-switch {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .locale-btn {
    padding: 6px 16px;
    font-size: 14px;
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    background: transparent;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: all 0.2s;
  }

  .locale-btn:hover {
    border-color: hsl(var(--primary));
    color: hsl(var(--foreground));
  }

  .locale-btn.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
  }

  .demo-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    .demo-content {
      grid-template-columns: 1fr;
    }
  }

  .editor-panel,
  .output-panel {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    padding: 20px;
  }

  .editor-panel h2,
  .output-panel h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: hsl(var(--foreground));
  }

  .json-output {
    background: hsl(var(--muted));
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;
    max-height: 500px;
    overflow-y: auto;
  }

  .json-output code {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    color: hsl(var(--foreground));
  }
</style>
