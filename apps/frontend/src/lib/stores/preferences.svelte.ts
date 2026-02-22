/**
 * 个性化设置 Store
 * 管理主题、语言等用户偏好设置
 * 支持与服务器同步
 */

import { authStore } from './auth.svelte';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'slate' | 'zinc' | 'neutral' | 'stone' | 'blue' | 'green' | 'violet' | 'orange' | 'rose';
export type Language = 'zh-CN' | 'en';

export interface Preferences {
  /** 主题模式 */
  theme: ThemeMode;
  /** 主题色 */
  themeColor: ThemeColor;
  /** 界面语言 */
  language: Language;
  /** 字体大小 */
  fontSize: number;
  /** 圆角大小 */
  radius: number;
  /** 默认文本生成模型 ID */
  defaultTextModelId: string | null;
  /** 默认图像生成模型 ID */
  defaultImageModelId: string | null;
  /** 默认对象生成模型 ID */
  defaultObjectModelId: string | null;
}

// 服务器返回的偏好设置响应
interface PreferencesResponse {
  preferences: Partial<Preferences> | null;
}

const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  themeColor: 'slate',
  language: 'zh-CN',
  fontSize: 14,
  radius: 0.5,
  defaultTextModelId: null,
  defaultImageModelId: null,
  defaultObjectModelId: null,
};

const STORAGE_KEY = 'user-preferences';

// 主题色配置 - 使用 oklch 颜色空间
export const THEME_COLORS: Record<ThemeColor, { label: string; preview: string; light: Record<string, string>; dark: Record<string, string> }> = {
  slate: {
    label: '石板灰',
    preview: '#64748b',
    light: {
      '--primary': 'oklch(0.208 0.042 265.755)',
      '--primary-foreground': 'oklch(0.984 0.003 247.858)',
      '--ring': 'oklch(0.704 0.04 256.788)',
    },
    dark: {
      '--primary': 'oklch(0.929 0.013 255.508)',
      '--primary-foreground': 'oklch(0.208 0.042 265.755)',
      '--ring': 'oklch(0.551 0.027 264.364)',
    },
  },
  zinc: {
    label: '锌灰',
    preview: '#71717a',
    light: {
      '--primary': 'oklch(0.21 0.006 285.885)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.705 0.015 286.067)',
    },
    dark: {
      '--primary': 'oklch(0.92 0.004 286.32)',
      '--primary-foreground': 'oklch(0.21 0.006 285.885)',
      '--ring': 'oklch(0.552 0.016 285.938)',
    },
  },
  neutral: {
    label: '中性灰',
    preview: '#737373',
    light: {
      '--primary': 'oklch(0.205 0 0)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.708 0 0)',
    },
    dark: {
      '--primary': 'oklch(0.922 0 0)',
      '--primary-foreground': 'oklch(0.205 0 0)',
      '--ring': 'oklch(0.556 0 0)',
    },
  },
  stone: {
    label: '石灰',
    preview: '#78716c',
    light: {
      '--primary': 'oklch(0.216 0.006 56.043)',
      '--primary-foreground': 'oklch(0.985 0.001 106.423)',
      '--ring': 'oklch(0.709 0.01 56.259)',
    },
    dark: {
      '--primary': 'oklch(0.923 0.003 48.717)',
      '--primary-foreground': 'oklch(0.216 0.006 56.043)',
      '--ring': 'oklch(0.553 0.013 58.071)',
    },
  },
  blue: {
    label: '蓝色',
    preview: '#3b82f6',
    light: {
      '--primary': 'oklch(0.546 0.245 262.881)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.546 0.245 262.881)',
    },
    dark: {
      '--primary': 'oklch(0.623 0.214 259.815)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.623 0.214 259.815)',
    },
  },
  green: {
    label: '绿色',
    preview: '#22c55e',
    light: {
      '--primary': 'oklch(0.723 0.219 149.579)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.723 0.219 149.579)',
    },
    dark: {
      '--primary': 'oklch(0.696 0.17 162.48)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.696 0.17 162.48)',
    },
  },
  violet: {
    label: '紫色',
    preview: '#8b5cf6',
    light: {
      '--primary': 'oklch(0.541 0.281 293.009)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.541 0.281 293.009)',
    },
    dark: {
      '--primary': 'oklch(0.627 0.265 303.9)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.627 0.265 303.9)',
    },
  },
  orange: {
    label: '橙色',
    preview: '#f97316',
    light: {
      '--primary': 'oklch(0.705 0.213 47.604)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.705 0.213 47.604)',
    },
    dark: {
      '--primary': 'oklch(0.769 0.188 70.08)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.769 0.188 70.08)',
    },
  },
  rose: {
    label: '玫红',
    preview: '#f43f5e',
    light: {
      '--primary': 'oklch(0.645 0.246 16.439)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.645 0.246 16.439)',
    },
    dark: {
      '--primary': 'oklch(0.645 0.246 16.439)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.645 0.246 16.439)',
    },
  },
};

// 字体大小预设
export const FONT_SIZE_OPTIONS = [
  { value: 12, label: '小' },
  { value: 14, label: '标准' },
  { value: 16, label: '大' },
  { value: 18, label: '超大' },
];

// 圆角预设
export const RADIUS_OPTIONS = [
  { value: 0, label: '无圆角' },
  { value: 0.3, label: '小' },
  { value: 0.5, label: '中' },
  { value: 0.75, label: '大' },
  { value: 1, label: '超大' },
];

function createPreferencesStore() {
  let preferences = $state<Preferences>({ ...DEFAULT_PREFERENCES });
  let syncing = $state(false);
  let initialized = $state(false);

  // 防抖保存到服务器
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  function loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Preferences>;
        preferences = { ...DEFAULT_PREFERENCES, ...parsed };
      } catch {
        // 解析失败，使用默认值
      }
    }
  }

  function saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }

  // 从服务器加载偏好设置
  async function loadFromServer(): Promise<void> {
    if (!authStore.isAuthenticated) return;
    
    try {
      // 使用 fetch 直接调用，因为 API 类型尚未重新生成
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030'}/api/system/user/preferences`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const result = await response.json() as PreferencesResponse;
        if (result.preferences) {
          preferences = { ...DEFAULT_PREFERENCES, ...result.preferences };
          saveToStorage(); // 同步到本地存储
        }
      }
    } catch (e) {
      console.error('Failed to load preferences from server:', e);
      // 失败时使用本地存储
    }
  }

  // 保存到服务器（防抖）
  function saveToServer(): void {
    if (!authStore.isAuthenticated) return;
    
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    saveTimeout = setTimeout(async () => {
      syncing = true;
      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030'}/api/system/user/preferences`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authStore.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              preferences: {
                theme: preferences.theme,
                themeColor: preferences.themeColor,
                language: preferences.language,
                fontSize: preferences.fontSize,
                radius: preferences.radius,
                defaultTextModelId: preferences.defaultTextModelId,
                defaultImageModelId: preferences.defaultImageModelId,
                defaultObjectModelId: preferences.defaultObjectModelId,
              },
            }),
          }
        );
      } catch (e) {
        console.error('Failed to save preferences to server:', e);
      } finally {
        syncing = false;
      }
    }, 500);
  }

  function applyThemeColor(color: ThemeColor): void {
    if (typeof document === 'undefined') return;
    
    const config = THEME_COLORS[color];
    if (!config) return;

    // 根据当前主题模式选择颜色
    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? config.dark : config.light;

    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  function applyRadius(radius: number): void {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--radius', `${radius}rem`);
  }

  function applyFontSize(size: number): void {
    if (typeof document === 'undefined') return;
    document.documentElement.style.fontSize = `${size}px`;
  }

  function applyAll(): void {
    applyThemeColor(preferences.themeColor);
    applyRadius(preferences.radius);
    applyFontSize(preferences.fontSize);
  }

  function setTheme(theme: ThemeMode): void {
    preferences.theme = theme;
    saveToStorage();
    saveToServer();
    // 主题色需要重新应用（因为 light/dark 颜色不同）
    setTimeout(() => applyThemeColor(preferences.themeColor), 50);
  }

  function setThemeColor(color: ThemeColor): void {
    preferences.themeColor = color;
    applyThemeColor(color);
    saveToStorage();
    saveToServer();
  }

  function setLanguage(language: Language): void {
    preferences.language = language;
    saveToStorage();
    saveToServer();
  }

  function setFontSize(size: number): void {
    preferences.fontSize = size;
    applyFontSize(size);
    saveToStorage();
    saveToServer();
  }

  function setRadius(radius: number): void {
    preferences.radius = radius;
    applyRadius(radius);
    saveToStorage();
    saveToServer();
  }

  function reset(): void {
    preferences = { ...DEFAULT_PREFERENCES };
    applyAll();
    saveToStorage();
    saveToServer();
  }

  function setDefaultTextModelId(modelId: string | null): void {
    preferences.defaultTextModelId = modelId;
    saveToStorage();
    saveToServer();
  }

  function setDefaultImageModelId(modelId: string | null): void {
    preferences.defaultImageModelId = modelId;
    saveToStorage();
    saveToServer();
  }

  function setDefaultObjectModelId(modelId: string | null): void {
    preferences.defaultObjectModelId = modelId;
    saveToStorage();
    saveToServer();
  }

  async function init(): Promise<void> {
    if (initialized) return;
    
    // 先从本地存储加载（快速显示）
    loadFromStorage();
    applyAll();
    
    // 然后从服务器加载（如果已登录）
    if (authStore.isAuthenticated) {
      await loadFromServer();
      applyAll();
    }
    
    initialized = true;
  }

  // 用户登录后重新加载偏好设置
  async function onLogin(): Promise<void> {
    await loadFromServer();
    applyAll();
  }

  return {
    get theme() { return preferences.theme; },
    get themeColor() { return preferences.themeColor; },
    get language() { return preferences.language; },
    get fontSize() { return preferences.fontSize; },
    get radius() { return preferences.radius; },
    get defaultTextModelId() { return preferences.defaultTextModelId; },
    get defaultImageModelId() { return preferences.defaultImageModelId; },
    get defaultObjectModelId() { return preferences.defaultObjectModelId; },
    get syncing() { return syncing; },
    setTheme,
    setThemeColor,
    setLanguage,
    setFontSize,
    setRadius,
    setDefaultTextModelId,
    setDefaultImageModelId,
    setDefaultObjectModelId,
    reset,
    init,
    onLogin,
  };
}

export const preferencesStore = createPreferencesStore();
