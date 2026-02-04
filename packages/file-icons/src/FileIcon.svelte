<script lang="ts">
  import { getIconByExtension } from './icons/index';

  interface Props {
    type: string;
    size?: number;
  }

  let { type, size = 24 }: Props = $props();

  let svgContent = $derived(getIconByExtension(type));
</script>

<span
  class="file-icon"
  style="width: {size}px; height: {size}px; display: inline-flex;"
>
  {@html svgContent}
</span>

<style>
  .file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .file-icon :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
