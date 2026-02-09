import { m } from '@qiyu-allinai/i18n';
import { getLocale, setLocale as setParaglideLocale } from '@qiyu-allinai/i18n/runtime';

type Locale = 'zh-Hans' | 'en';
type MessageFn = (inputs?: Record<string, unknown>, options?: { locale?: string }) => string;
type Messages = Record<string, MessageFn>;

const msg = m as unknown as Messages;
const STORAGE_KEY = 'app_locale';

function createI18nStore() {
  let locale = $state<Locale>('zh-Hans');

  // 从 localStorage 恢复
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === 'zh-Hans' || saved === 'en')) {
      locale = saved;
      setParaglideLocale(saved, { reload: false });
    } else {
      // 根据浏览器语言自动选择
      const browserLang = navigator.language;
      locale = browserLang.startsWith('zh') ? 'zh-Hans' : 'en';
      setParaglideLocale(locale, { reload: false });
    }
  }

  function setLocale(newLocale: Locale) {
    locale = newLocale;
    setParaglideLocale(newLocale, { reload: false });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }

  // 翻译函数 - 通过 key 获取翻译
  function t(key: string, fallback?: string): string {
    // 将点分隔的 key 转换为下划线格式
    const normalizedKey = key.replace(/\./g, '_');
    const fn = msg[normalizedKey];
    return fn ? fn() : (fallback || key);
  }

  return {
    get locale() { return locale; },
    setLocale,
    t,
  };
}

export const i18n = createI18nStore();

// 便捷翻译函数
export function t(key: string, fallback?: string): string {
  return i18n.t(key, fallback);
}
