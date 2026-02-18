/**
 * Actions Store
 * 一次性获取所有可用 Actions，sessionStorage 持久化
 * 用于 MCP Server 配置等场景
 */

import { authStore } from './auth.svelte';

export interface ActionInfo {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  method: string;
  path: string;
}

const STORAGE_KEY = 'system-actions';

function createActionsStore() {
  let actions = $state<ActionInfo[]>([]);
  let isLoaded = $state(false);
  let isLoading = $state(false);

  function loadFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        actions = JSON.parse(stored);
        isLoaded = true;
        return true;
      } catch {
        // 解析失败
      }
    }
    return false;
  }

  function saveToStorage(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  }

  async function load(force = false): Promise<void> {
    if (isLoaded && !force) return;
    if (!force && loadFromStorage()) return;

    isLoading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.actions.getApiActions();
      console.log(res)
      // res 结构: { data: ActionInfo[], status: number, message: string }
      if (res?.data) {
        actions = res.data as ActionInfo[];
        isLoaded = true;
        saveToStorage();
      }
    } catch (err) {
      console.error('Failed to load actions:', err);
    } finally {
      isLoading = false;
    }
  }

  function getAll(): ActionInfo[] {
    return actions;
  }

  function getByTag(tag: string): ActionInfo[] {
    return actions.filter(a => a.tags.includes(tag));
  }

  function getByName(name: string): ActionInfo | undefined {
    return actions.find(a => a.name === name);
  }

  function search(keyword: string): ActionInfo[] {
    const kw = keyword.toLowerCase();
    return actions.filter(a =>
      a.name.toLowerCase().includes(kw) ||
      a.displayName.toLowerCase().includes(kw) ||
      a.tags.some(t => t.toLowerCase().includes(kw))
    );
  }

  function clear(): void {
    actions = [];
    isLoaded = false;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    get isLoaded() { return isLoaded; },
    get isLoading() { return isLoading; },
    get actions() { return actions; },
    load,
    getAll,
    getByTag,
    getByName,
    search,
    clear,
  };
}

export const actionsStore = createActionsStore();
