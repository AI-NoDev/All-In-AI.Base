<script lang="ts">
  import Icon from '@iconify/svelte';
  import { getIconByExtension, getIconByFilename, getFolderIcon } from './icons/index';

  interface Props {
    /** 文件扩展名或完整文件名 */
    type: string;
    /** 图标大小 (px) */
    size?: number;
    /** 是否为文件夹 */
    isFolder?: boolean;
    /** 文件夹是否展开 */
    isOpen?: boolean;
    /** 自定义 class */
    class?: string;
  }

  let { type, size = 20, isFolder = false, isOpen = false, class: className = '' }: Props = $props();

  let iconName = $derived.by(() => {
    if (isFolder) {
      return getFolderIcon(type, isOpen);
    }
    // 如果包含点号，认为是完整文件名
    if (type.includes('.')) {
      return getIconByFilename(type);
    }
    return getIconByExtension(type);
  });
</script>

<Icon icon={iconName} width={size} height={size} class={className} />
