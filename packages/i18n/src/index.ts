import i18next from 'i18next';
import type { i18n, InitOptions, Resource } from 'i18next';

// 默认配置
const defaultOptions: InitOptions = {
  lng: 'zh-CN',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
};

// 创建 i18n 实例
export function createI18n(options?: InitOptions): i18n {
  const instance = i18next.createInstance();
  instance.init({
    ...defaultOptions,
    ...options,
  });
  return instance;
}

// 添加资源
export function addResources(instance: i18n, resources: Resource): void {
  Object.entries(resources).forEach(([lng, namespaces]) => {
    Object.entries(namespaces).forEach(([ns, translations]) => {
      instance.addResourceBundle(lng, ns, translations, true, true);
    });
  });
}

// 加载命名空间
export async function loadNamespace(instance: i18n, ns: string | string[]): Promise<void> {
  await instance.loadNamespaces(ns);
}

// 切换语言
export async function changeLanguage(instance: i18n, lng: string): Promise<void> {
  await instance.changeLanguage(lng);
}

// 获取当前语言
export function getCurrentLanguage(instance: i18n): string {
  return instance.language;
}

// 获取支持的语言列表
export function getSupportedLanguages(instance: i18n): readonly string[] {
  return instance.languages;
}

// 翻译函数类型
export type TFunction = i18n['t'];

// 导出类型
export type { i18n, InitOptions, Resource };

// 导出 i18next 实例（可选的全局实例）
export { i18next };

// 导出语言相关工具
export * from './locales';
export * from './types';
