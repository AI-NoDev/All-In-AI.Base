import { setLocale as setParaglideLocale } from '@qiyu-allinai/i18n/runtime';

type Locale = 'zh-Hans' | 'en';

// 消息缓存 - 非响应式，仅用于存储
let messagesCache: {
  'zh-Hans': Record<string, string>;
  'en': Record<string, string>;
} = {
  'zh-Hans': {},
  'en': {},
};

// 响应式状态
let currentLocale = $state<Locale>('zh-Hans');
let version = $state(0); // 用于强制触发更新

const STORAGE_KEY = 'app_locale';

// 加载消息
async function loadMessages(): Promise<void> {
  try {
    const [zhModule, enModule] = await Promise.all([
      import('@qiyu-allinai/i18n/messages/zh-Hans.json'),
      import('@qiyu-allinai/i18n/messages/en.json'),
    ]);
    
    messagesCache['zh-Hans'] = (zhModule.default || zhModule) as Record<string, string>;
    messagesCache['en'] = (enModule.default || enModule) as Record<string, string>;
    
    // 触发更新
    version++;
  } catch (e) {
    console.error('Failed to load i18n messages:', e);
  }
}

// 初始化
if (typeof window !== 'undefined') {
  // 从 localStorage 恢复语言设置
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && (saved === 'zh-Hans' || saved === 'en')) {
    currentLocale = saved;
  } else {
    const browserLang = navigator.language;
    currentLocale = browserLang.startsWith('zh') ? 'zh-Hans' : 'en';
  }
  setParaglideLocale(currentLocale, { reload: false });
  
  // 加载消息
  loadMessages();
}

function setLocale(newLocale: Locale) {
  if (currentLocale === newLocale) return;
  
  currentLocale = newLocale;
  setParaglideLocale(newLocale, { reload: false });
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, newLocale);
  }
  
  // 触发更新
  version++;
}

/**
 * 翻译函数 - 在组件中使用时，需要配合 $derived 或在模板中直接调用
 * 
 * 用法示例：
 * - 模板中: {t('page.preferences.title')}
 * - 响应式变量: let label = $derived(t('page.preferences.title'))
 * - 强制刷新: {#key i18n.version} ... {/key}
 */
function translate(key: string, fallback?: string): string {
  // 读取响应式状态以建立依赖
  const loc = currentLocale;
  const _ = version; // 读取 version 建立依赖
  
  const normalizedKey = key.replace(/\./g, '_');
  const messages = messagesCache[loc];
  return messages[normalizedKey] ?? (fallback ?? key);
}

export const i18n = {
  get locale() { return currentLocale; },
  get version() { return version; },
  setLocale,
  translate,
};

/**
 * 翻译函数快捷方式
 * key 格式: 'page.preferences.title' 会被转换为 'page_preferences_title'
 */
export function t(key: string, fallback?: string): string {
  return translate(key, fallback);
}

/**
 * 获取当前语言 - 用于在 $derived 中建立依赖
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * 获取版本号 - 用于 {#key} 强制刷新
 */
export function getVersion(): number {
  return version;
}
