# 前端开发

本项目前端使用 SvelteKit + Svelte 5 + shadcn-svelte 构建。

## 添加新页面

### 1. 创建页面文件

在 `apps/frontend/src/routes/dashboard/` 下创建目录和文件：

```
apps/frontend/src/routes/dashboard/system/posts/
├── +page.ts       # 页面元数据
├── +page.svelte   # 页面组件
└── components/    # 页面专用组件（可选）
```

### 2. 定义页面元数据

```typescript
// +page.ts
export const _meta = {
  title: 'nav.title.posts',        // 页面标题（i18n key）
  icon: 'tdesign:user-business',   // 图标（iconify 格式）
  group: 'nav.group.system',       // 导航分组
  order: 14,                       // 排序（数字越小越靠前）
  permission: 'system:post:view',  // 权限标识
  hidden: false,                   // 是否隐藏（默认 false）
};
```

### 3. 编写页面组件

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  
  // 定义类型
  interface Post {
    id: string;
    name: string;
    code: string;
    sort: number;
    status: string;
  }
  
  // 状态
  let posts = $state<Post[]>([]);
  let loading = $state(false);
  let total = $state(0);
  
  // 筛选条件
  let filter = $state({
    name: '',
    status: '',
  });
  
  // 分页
  let pagination = $state({
    limit: 20,
    offset: 0,
  });
  
  // API 实例
  const api = authStore.createApi(true);
  
  // 加载数据
  async function loadData() {
    loading = true;
    try {
      const res = await api.system.postApiSystemPostQuery({
        filter,
        ...pagination,
        sort: { field: 'sort', order: 'asc' },
      });
      posts = res.data?.data ?? [];
      total = res.data?.total ?? 0;
    } finally {
      loading = false;
    }
  }
  
  // 初始加载
  $effect(() => {
    loadData();
  });
</script>

<div class="p-4 space-y-4">
  <!-- 搜索栏 -->
  <div class="flex gap-2">
    <Input 
      placeholder="岗位名称" 
      bind:value={filter.name}
      class="w-48"
    />
    <Button onclick={loadData}>搜索</Button>
  </div>
  
  <!-- 数据表格 -->
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>岗位名称</Table.Head>
        <Table.Head>岗位编码</Table.Head>
        <Table.Head>排序</Table.Head>
        <Table.Head>状态</Table.Head>
        <Table.Head>操作</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each posts as post}
        <Table.Row>
          <Table.Cell>{post.name}</Table.Cell>
          <Table.Cell>{post.code}</Table.Cell>
          <Table.Cell>{post.sort}</Table.Cell>
          <Table.Cell>{post.status === '0' ? '正常' : '停用'}</Table.Cell>
          <Table.Cell>
            <Button variant="ghost" size="sm">编辑</Button>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

## Svelte 5 语法

### 响应式状态

```svelte
<script lang="ts">
  // 基础状态
  let count = $state(0);
  
  // 带类型的状态
  let users = $state<User[]>([]);
  
  // 对象状态
  let form = $state({
    name: '',
    email: '',
  });
</script>
```

### 派生状态

```svelte
<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');
  
  // 派生状态，自动响应依赖变化
  let filteredItems = $derived(
    items.filter(item => item.name.includes(filter))
  );
  
  let total = $derived(items.length);
  let isEmpty = $derived(items.length === 0);
</script>
```

### 副作用

```svelte
<script lang="ts">
  let userId = $state('');
  let user = $state<User | null>(null);
  
  // 当 userId 变化时自动执行
  $effect(() => {
    if (userId) {
      loadUser(userId);
    }
  });
  
  async function loadUser(id: string) {
    const res = await api.system.getApiSystemUser({ id });
    user = res.data?.data ?? null;
  }
</script>
```

### Props

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onClose?: () => void;
  }
  
  let { title, count = 0, onClose }: Props = $props();
</script>
```

## API 调用

### 获取 API 实例

```typescript
import { authStore } from '$lib/stores/auth.svelte';

// 带认证的 API（自动注入 Token 和审计字段）
const api = authStore.createApi(true);

// 不带认证的 API
const publicApi = authStore.createApi(false);
```

### 查询数据

```typescript
// 分页查询
const res = await api.system.postApiSystemPostQuery({
  filter: { status: '0' },
  sort: { field: 'createdAt', order: 'desc' },
  limit: 20,
  offset: 0,
});

// 根据 ID 查询
const res = await api.system.getApiSystemPost({ id: 'xxx' });
```

### 创建数据

```typescript
// 创建（审计字段自动注入）
const res = await api.system.postApiSystemPost({
  data: {
    name: '新岗位',
    code: 'NEW_POST',
    sort: 1,
    status: '0',
  },
});
```

### 更新数据

```typescript
const res = await api.system.putApiSystemPost({
  id: 'xxx',
  data: {
    name: '更新后的名称',
  },
});
```

### 删除数据

```typescript
const res = await api.system.deleteApiSystemPost({ id: 'xxx' });
```

## shadcn-svelte 组件

### 安装组件

```bash
cd apps/frontend
bunx shadcn-svelte@latest add button
bunx shadcn-svelte@latest add input
bunx shadcn-svelte@latest add table
bunx shadcn-svelte@latest add dialog
```

### 常用组件

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
</script>

<!-- 按钮 -->
<Button variant="default">默认</Button>
<Button variant="outline">边框</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="destructive">危险</Button>

<!-- 输入框 -->
<div class="space-y-2">
  <Label for="name">名称</Label>
  <Input id="name" bind:value={form.name} />
</div>

<!-- 选择器 -->
<Select.Root bind:value={form.status}>
  <Select.Trigger>
    <Select.Value placeholder="选择状态" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="0">正常</Select.Item>
    <Select.Item value="1">停用</Select.Item>
  </Select.Content>
</Select.Root>

<!-- 对话框 -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>标题</Dialog.Title>
      <Dialog.Description>描述</Dialog.Description>
    </Dialog.Header>
    <div>内容</div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSubmit}>确定</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## 图标使用

使用 Iconify 图标：

```svelte
<script lang="ts">
  import Icon from '@iconify/svelte';
</script>

<Icon icon="tdesign:user" class="w-5 h-5" />
<Icon icon="mdi:home" class="w-6 h-6 text-primary" />
```

常用图标集：
- `tdesign:*` - TDesign 图标
- `mdi:*` - Material Design Icons
- `lucide:*` - Lucide 图标

## 表单验证

使用 TypeBox（Elysia 的 `t`）进行表单验证：

```svelte
<script lang="ts">
  import { t, type Static } from 'elysia';
  import { Value } from '@sinclair/typebox/value';
  
  const formSchema = t.Object({
    name: t.String({ minLength: 1, maxLength: 50, error: '名称不能为空（最多50个字符）' }),
    code: t.String({ minLength: 1, pattern: '^[A-Z_]+$', error: '编码只能包含大写字母和下划线' }),
    sort: t.Number({ minimum: 0, error: '排序不能为负数' }),
  });
  
  type FormData = Static<typeof formSchema>;
  
  let form = $state<FormData>({
    name: '',
    code: '',
    sort: 0,
  });
  
  let errors = $state<Record<string, string>>({});
  
  function validate() {
    const result = Value.Check(formSchema, form);
    if (!result) {
      errors = {};
      const errs = [...Value.Errors(formSchema, form)];
      errs.forEach(err => {
        const path = err.path.replace('/', '');
        errors[path] = err.message;
      });
      return false;
    }
    errors = {};
    return true;
  }
  
  async function handleSubmit() {
    if (!validate()) return;
    // 提交表单
  }
</script>

<div class="space-y-4">
  <div>
    <Label>名称</Label>
    <Input bind:value={form.name} />
    {#if errors.name}
      <p class="text-sm text-destructive">{errors.name}</p>
    {/if}
  </div>
</div>
```

## 下一步

- [Action 开发](/docs/zh-CN/backend/actions) - 学习后端 API 开发
- [实体开发](/docs/zh-CN/backend/entities) - 学习数据库实体定义
