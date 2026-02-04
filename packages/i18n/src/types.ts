import type { Resource } from 'i18next';

// 支持的语言
export type SupportedLanguage = 'zh-CN' | 'en';

// 命名空间
export type Namespace = 'common' | 'system' | 'ai' | 'knowledge' | 'error' | 'validation';

// 语言配置
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

// 语言列表
export const languages: LanguageConfig[] = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
];

// 获取语言配置
export function getLanguageConfig(code: SupportedLanguage): LanguageConfig | undefined {
  return languages.find(lang => lang.code === code);
}

// 检查是否支持的语言
export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return languages.some(lang => lang.code === code);
}

// 模块资源类型
export type ModuleResources = {
  [lng in SupportedLanguage]?: {
    [ns in Namespace]?: Record<string, unknown>;
  };
};

// 合并资源
export function mergeResources(...resources: ModuleResources[]): Resource {
  const merged: Resource = {};
  
  for (const resource of resources) {
    for (const [lng, namespaces] of Object.entries(resource)) {
      if (!merged[lng]) merged[lng] = {};
      for (const [ns, translations] of Object.entries(namespaces!)) {
        merged[lng]![ns] = {
          ...(merged[lng]![ns] as Record<string, unknown> ?? {}),
          ...(translations as Record<string, unknown>),
        };
      }
    }
  }
  
  return merged;
}
