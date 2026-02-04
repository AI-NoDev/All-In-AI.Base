import { zhCN, en } from "@qiyu-allinai/i18n";

type Locale = "zh-CN" | "en";

const resources = {
  "zh-CN": zhCN,
  "en": en,
} as const;

const STORAGE_KEY = "app_locale";

function createI18nStore() {
  let locale = $state<Locale>("zh-CN");

  // 从 localStorage 恢复
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === "zh-CN" || saved === "en")) {
      locale = saved;
    } else {
      // 根据浏览器语言自动选择
      const browserLang = navigator.language;
      locale = browserLang.startsWith("zh") ? "zh-CN" : "en";
    }
  }

  function setLocale(newLocale: Locale) {
    locale = newLocale;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }

  // 翻译函数 - 支持点分隔的 key，如 "error.auth.loginSuccess"
  function t(key: string, fallback?: string): string {
    const keys = key.split(".");
    let value: any = resources[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === "string" ? value : fallback || key;
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
