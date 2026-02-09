/**
 * i18n Plugin
 * 
 * 基于 Paraglide JS 的国际化中间件
 * 从请求头 Accept-Language 解析语言，设置到上下文中
 */

import { Elysia } from 'elysia';
import { paraglideMiddleware } from '@qiyu-allinai/i18n/server';
import { getLocale, setLocale, type Locale } from '@qiyu-allinai/i18n/runtime';

const SUPPORTED_LOCALES: Locale[] = ['zh-Hans', 'en'];
const DEFAULT_LOCALE: Locale = 'zh-Hans';

/**
 * 从 Accept-Language 头解析首选语言
 */
function parseAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  
  // 解析 Accept-Language 头，格式如: zh-CN,zh;q=0.9,en;q=0.8
  const languages = header.split(',').map(lang => {
    const [code, qValue] = lang.trim().split(';q=');
    return {
      code: code.trim().toLowerCase(),
      q: qValue ? parseFloat(qValue) : 1.0
    };
  }).sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    // 匹配 zh-Hans, zh-CN, zh 等
    if (code.startsWith('zh')) return 'zh-Hans';
    if (code.startsWith('en')) return 'en';
  }

  return DEFAULT_LOCALE;
}

export const i18nPlugin = new Elysia({ name: 'plugin/i18n' })
  .derive(async ({ request }) => {
    let locale: Locale = DEFAULT_LOCALE;
    
    // 优先从 X-Locale 头获取（前端可以显式设置）
    const xLocale = request.headers.get('X-Locale');
    if (xLocale && SUPPORTED_LOCALES.includes(xLocale as Locale)) {
      locale = xLocale as Locale;
    } else {
      // 否则从 Accept-Language 解析
      locale = parseAcceptLanguage(request.headers.get('Accept-Language'));
    }

    // 使用 paraglide middleware 设置 locale 上下文
    await paraglideMiddleware(request, async ({ locale: l }) => {
      locale = l as Locale;
      return new Response();
    });

    // 设置全局 locale
    setLocale(locale, { reload: false });

    return { locale };
  })
  .onBeforeHandle(({ locale }) => {
    // 确保每个请求都设置正确的 locale
    if (locale) {
      setLocale(locale, { reload: false });
    }
  });
