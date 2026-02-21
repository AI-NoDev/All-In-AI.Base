/**
 * 系统参数 Store
 * 一次性获取所有系统参数，sessionStorage 持久化
 */

import { authStore } from './auth.svelte';

interface ConfigItem {
  id: string;
  name: string;
  key: string;
  value: string;
  isSystem: boolean;
}

const STORAGE_KEY = 'system-configs';

function createSystemConfigStore() {
  let configs = $state<ConfigItem[]>([]);
  let isLoaded = $state(false);
  let isLoading = $state(false);

  function loadFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        configs = JSON.parse(stored);
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  }

  async function load(force = false): Promise<void> {
    // 如果已加载且不强制刷新，直接返回
    if (isLoaded && !force) return;
    
    // 尝试从 sessionStorage 加载
    if (!force && loadFromStorage()) return;

    isLoading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemConfigQuery({
        limit: 100,
        offset: 0,
      });
      if (res.data?.data) {
        configs = res.data.data;
        isLoaded = true;
        saveToStorage();
      }
    } catch (err) {
      console.error('Failed to load system configs:', err);
    } finally {
      isLoading = false;
    }
  }

  function get(key: string, defaultValue = ''): string {
    const item = configs.find(c => c.key === key);
    return item?.value ?? defaultValue;
  }

  /**
   * 获取站点名称
   * 优先级：系统配置 > 环境变量 > 默认值
   */
  function getSiteName(): string {
    const configValue = get('sys.site.name', '');
    if (configValue) return configValue;
    
    const envValue = import.meta.env.VITE_WEB_SITE_NAME;
    if (envValue) return envValue;
    
    return 'All In AI System';
  }

  function getAll(): ConfigItem[] {
    return configs;
  }

  function clear(): void {
    configs = [];
    isLoaded = false;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    get isLoaded() { return isLoaded; },
    get isLoading() { return isLoading; },
    load,
    get,
    getSiteName,
    getAll,
    clear,
  };
}

export const systemConfigStore = createSystemConfigStore();
