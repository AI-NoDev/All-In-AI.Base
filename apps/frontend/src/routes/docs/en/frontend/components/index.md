# Frontend Development

This project's frontend is built with SvelteKit + Svelte 5 + shadcn-svelte.

## Adding a New Page

### 1. Create Page Files

Create a directory and files under `apps/frontend/src/routes/dashboard/`:

```
apps/frontend/src/routes/dashboard/system/posts/
├── +page.ts       # Page metadata
├── +page.svelte   # Page component
└── components/    # Page-specific components (optional)
```

### 2. Define Page Metadata

```typescript
// +page.ts
export const _meta = {
  title: 'nav.title.posts',        // Page title (i18n key)
  icon: 'tdesign:user-business',   // Icon (iconify format)
  group: 'nav.group.system',       // Navigation group
  order: 14,                       // Sort order (lower = higher)
  permission: 'system:post:view',  // Permission identifier
  hidden: false,                   // Whether to hide (default false)
};
```

### 3. Write Page Component

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  
  // Define types
  interface Post {
    id: string;
    name: string;
    code: string;
    sort: number;
    status: string;
  }
  
  // State
  let posts = $state<Post[]>([]);
  let loading = $state(false);
  let total = $state(0);
  
  // Filter conditions
  let filter = $state({
    name: '',
    status: '',
  });
  
  // Pagination
  let pagination = $state({
    limit: 20,
    offset: 0,
  });
  
  // API instance
  const api = authStore.createApi(true);
  
  // Load data
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
  
  // Initial load
  $effect(() => {
    loadData();
  });
</script>

<div class="p-4 space-y-4">
  <!-- Search bar -->
  <div class="flex gap-2">
    <Input 
      placeholder="Post name" 
      bind:value={filter.name}
      class="w-48"
    />
    <Button onclick={loadData}>Search</Button>
  </div>
  
  <!-- Data table -->
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Post Name</Table.Head>
        <Table.Head>Post Code</Table.Head>
        <Table.Head>Sort</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each posts as post}
        <Table.Row>
          <Table.Cell>{post.name}</Table.Cell>
          <Table.Cell>{post.code}</Table.Cell>
          <Table.Cell>{post.sort}</Table.Cell>
          <Table.Cell>{post.status === '0' ? 'Active' : 'Disabled'}</Table.Cell>
          <Table.Cell>
            <Button variant="ghost" size="sm">Edit</Button>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

## Svelte 5 Syntax

### Reactive State

```svelte
<script lang="ts">
  // Basic state
  let count = $state(0);
  
  // Typed state
  let users = $state<User[]>([]);
  
  // Object state
  let form = $state({
    name: '',
    email: '',
  });
</script>
```

### Derived State

```svelte
<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');
  
  // Derived state, automatically responds to dependency changes
  let filteredItems = $derived(
    items.filter(item => item.name.includes(filter))
  );
  
  let total = $derived(items.length);
  let isEmpty = $derived(items.length === 0);
</script>
```

### Effects

```svelte
<script lang="ts">
  let userId = $state('');
  let user = $state<User | null>(null);
  
  // Automatically executes when userId changes
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

## API Calls

### Getting API Instance

```typescript
import { authStore } from '$lib/stores/auth.svelte';

// Authenticated API (auto-injects Token and audit fields)
const api = authStore.createApi(true);

// Unauthenticated API
const publicApi = authStore.createApi(false);
```

### Querying Data

```typescript
// Paginated query
const res = await api.system.postApiSystemPostQuery({
  filter: { status: '0' },
  sort: { field: 'createdAt', order: 'desc' },
  limit: 20,
  offset: 0,
});

// Get by ID
const res = await api.system.getApiSystemPost({ id: 'xxx' });
```

### Creating Data

```typescript
// Create (audit fields auto-injected)
const res = await api.system.postApiSystemPost({
  data: {
    name: 'New Post',
    code: 'NEW_POST',
    sort: 1,
    status: '0',
  },
});
```

### Updating Data

```typescript
const res = await api.system.putApiSystemPost({
  id: 'xxx',
  data: {
    name: 'Updated Name',
  },
});
```

### Deleting Data

```typescript
const res = await api.system.deleteApiSystemPost({ id: 'xxx' });
```

## shadcn-svelte Components

### Installing Components

```bash
cd apps/frontend
bunx shadcn-svelte@latest add button
bunx shadcn-svelte@latest add input
bunx shadcn-svelte@latest add table
bunx shadcn-svelte@latest add dialog
```

### Common Components

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
</script>

<!-- Buttons -->
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

<!-- Input -->
<div class="space-y-2">
  <Label for="name">Name</Label>
  <Input id="name" bind:value={form.name} />
</div>

<!-- Select -->
<Select.Root bind:value={form.status}>
  <Select.Trigger>
    <Select.Value placeholder="Select status" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="0">Active</Select.Item>
    <Select.Item value="1">Disabled</Select.Item>
  </Select.Content>
</Select.Root>

<!-- Dialog -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
    <div>Content</div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>Cancel</Button>
      <Button onclick={handleSubmit}>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Using Icons

Use Iconify icons:

```svelte
<script lang="ts">
  import Icon from '@iconify/svelte';
</script>

<Icon icon="tdesign:user" class="w-5 h-5" />
<Icon icon="mdi:home" class="w-6 h-6 text-primary" />
```

Common icon sets:
- `tdesign:*` - TDesign icons
- `mdi:*` - Material Design Icons
- `lucide:*` - Lucide icons

## Form Validation

Use Zod for form validation:

```svelte
<script lang="ts">
  import { z } from 'zod';
  
  const formSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name max 50 characters'),
    code: z.string().min(1, 'Code is required').regex(/^[A-Z_]+$/, 'Code must be uppercase letters and underscores'),
    sort: z.number().min(0, 'Sort cannot be negative'),
  });
  
  let form = $state({
    name: '',
    code: '',
    sort: 0,
  });
  
  let errors = $state<Record<string, string>>({});
  
  function validate() {
    const result = formSchema.safeParse(form);
    if (!result.success) {
      errors = {};
      result.error.errors.forEach(err => {
        errors[err.path[0] as string] = err.message;
      });
      return false;
    }
    errors = {};
    return true;
  }
  
  async function handleSubmit() {
    if (!validate()) return;
    // Submit form
  }
</script>

<div class="space-y-4">
  <div>
    <Label>Name</Label>
    <Input bind:value={form.name} />
    {#if errors.name}
      <p class="text-sm text-destructive">{errors.name}</p>
    {/if}
  </div>
</div>
```

## Next Steps

- [Action Development](/docs/en/backend/actions) - Learn backend API development
- [Entity Development](/docs/en/backend/entities) - Learn database entity definition
