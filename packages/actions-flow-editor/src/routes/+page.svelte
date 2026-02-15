<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Toaster } from "@qiyu-allinai/ui/components/sonner/index.js";
  import ActionsFlowEditor from "$lib/components/ActionsFlowEditor/index.svelte";
  import type { ActionSummary, ActionDetail, JsonSchemaProperty } from "$lib/types.js";

  // Actions 数据从服务端 API 获取
  // GET /api/actions - 获取所有 actions 列表
  // GET /api/actions/:name - 获取 action 详情
  
  let actions = $state<ActionSummary[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // 示例：从 API 获取 actions（通过 Vite proxy 代理到后端）
  // 开发时使用相对路径，Vite 会代理到 http://localhost:3030
  const API_BASE = '';
  
  // Token 用于认证（实际使用时从 auth store 获取）
  let token = $state<string | null>(null);

  // 从 localStorage 读取 token（仅用于演示）
  $effect(() => {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }
  });

  // 示例 inputSchema：直接定义 JSON Schema 格式
  // 实际使用时可以通过 zod.toJSONSchema() 从 Zod Schema 生成
  const exampleInputSchema: Record<string, JsonSchemaProperty> = {
    userId: { 
      type: 'string', 
      format: 'uuid',
      description: '用户ID' 
    },
    userName: { 
      type: 'string', 
      minLength: 1, 
      maxLength: 50,
      description: '用户名' 
    },
    email: { 
      type: 'string', 
      format: 'email',
      description: '邮箱地址' 
    },
    age: { 
      type: 'integer', 
      minimum: 0, 
      maximum: 150,
      description: '年龄' 
    },
    roles: { 
      type: 'array', 
      items: { type: 'string' },
      description: '角色列表' 
    },
    profile: { 
      type: 'object',
      description: '用户资料',
      properties: {
        avatar: { type: 'string', format: 'uri', description: '头像URL' },
        bio: { type: 'string', maxLength: 500, description: '个人简介' },
        address: {
          type: 'object',
          description: '地址信息',
          properties: {
            country: { type: 'string', description: '国家' },
            city: { type: 'string', description: '城市' },
            street: { type: 'string', description: '街道' },
          }
        },
        social: {
          type: 'object',
          description: '社交账号',
          properties: {
            twitter: { type: 'string', description: 'Twitter' },
            github: { type: 'string', description: 'GitHub' },
          }
        }
      }
    },
  };

  async function loadActions() {
    try {
      loading = true;
      const res = await fetch(`${API_BASE}/api/actions`);
      const json = await res.json();
      actions = json.data ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load actions';
      // 使用 mock 数据作为 fallback
      actions = getMockActions();
    } finally {
      loading = false;
    }
  }

  async function getActionDetail(name: string): Promise<ActionDetail> {
    try {
      const res = await fetch(`${API_BASE}/api/actions/${encodeURIComponent(name)}`);
      const json = await res.json();
      if (json.data) return json.data;
      throw new Error('Action not found');
    } catch {
      // Fallback to mock
      return getMockActionDetail(name);
    }
  }

  // Mock 数据（开发/演示用）
  function getMockActions(): ActionSummary[] {
    return [
      {
        name: 'system.user.getByPagination',
        displayName: '分页查询用户',
        description: '分页查询用户列表',
        tags: ['system', 'user'],
        method: 'POST',
        path: '/api/system/user/query',
      },
      {
        name: 'system.user.create',
        displayName: '创建用户',
        description: '创建新用户',
        tags: ['system', 'user'],
        method: 'POST',
        path: '/api/system/user',
      },
      {
        name: 'ai.agent.getByPagination',
        displayName: '分页查询Agent',
        description: '分页查询AI Agent列表',
        tags: ['ai', 'agent'],
        method: 'POST',
        path: '/api/ai/agent/query',
      },
    ];
  }

  function getMockActionDetail(name: string): ActionDetail {
    const action = getMockActions().find((a) => a.name === name);
    if (!action) throw new Error(`Action not found: ${name}`);
    
    return {
      ...action,
      inputSchema: {
        body: {
          type: 'object',
          properties: {
            filter: { type: 'object', description: '过滤条件' },
            limit: { type: 'number', description: '每页数量' },
            offset: { type: 'number', description: '偏移量' },
          },
        },
      },
      outputSchema: {
        type: 'object',
        properties: {
          data: { type: 'array', description: '数据列表' },
          total: { type: 'number', description: '总数' },
        },
      },
    };
  }

  // 连接错误处理
  function handleConnectionError(reason: string) {
    toast.warning('无法连接', { description: reason });
  }

  // 节点运行处理（调试用）- 使用 sandbox 模式调用后端 API
  async function handleRunNode(nodeName: string, input: Record<string, unknown>): Promise<unknown> {
    console.log('Running node (sandbox):', nodeName, input);
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Sandbox': 'true',
    };
    
    // 如果有 token，添加 Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/actions/execute/${encodeURIComponent(nodeName)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.message || `HTTP ${res.status}`);
      }
      
      return json.data;
    } catch (e) {
      console.error('Sandbox execution failed:', e);
      throw e;
    }
  }

  // 加载 actions
  $effect(() => {
    loadActions();
  });
</script>

<div style="width: 100vw; height: 100vh;">
  {#if loading}
    <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
      Loading actions...
    </div>
  {:else if error}
    <div style="padding: 20px; color: #666;">
      <p>⚠️ {error}</p>
      <p>Using mock data for demo</p>
    </div>
    <ActionsFlowEditor 
      {actions} 
      {getActionDetail}
      inputSchema={exampleInputSchema}
      onWorkflowChange={(workflow) => console.log('Workflow changed:', workflow)}
      onConnectionError={handleConnectionError}
      onRunNode={handleRunNode}
    />
  {:else}
    <ActionsFlowEditor 
      {actions} 
      {getActionDetail}
      inputSchema={exampleInputSchema}
      onWorkflowChange={(workflow) => console.log('Workflow changed:', workflow)}
      onConnectionError={handleConnectionError}
      onRunNode={handleRunNode}
      colorMode="dark"
    />
  {/if}
</div>

<Toaster position="top-center" richColors />
