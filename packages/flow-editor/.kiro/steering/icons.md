# 图标使用规范

## 图标库

项目中统一使用 `@iconify/svelte` 配合 Google Material Icons 图标集。

## 使用方式

```svelte
<script>
  import Icon from '@iconify/svelte';
</script>

<Icon icon="material-symbols:icon-name" width="16" height="16" />
```

## 图标命名规范

- 使用 `material-symbols:` 前缀
- 图标名称使用 kebab-case 格式
- 常用图标示例：
  - `material-symbols:play-arrow` - 播放/开始
  - `material-symbols:stop` - 停止
  - `material-symbols:settings` - 设置
  - `material-symbols:add` - 添加
  - `material-symbols:delete` - 删除
  - `material-symbols:edit` - 编辑
  - `material-symbols:code` - 代码
  - `material-symbols:chat` - 对话/LLM
  - `material-symbols:condition` - 条件分支

## 节点图标颜色

节点图标背景色通过 `BaseNode` 的 `color` prop 设置，图标本身保持白色。

## 禁止事项

- 不要使用其他图标库（如 lucide、heroicons 等）
- 不要使用内联 SVG
- 不要使用图片作为图标
