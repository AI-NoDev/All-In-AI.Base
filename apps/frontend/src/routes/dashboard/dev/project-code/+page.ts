import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

/**
 * 项目代码页面 - 仅开发模式可�?
 * 生产模式访问会重定向到首�?
 */
export const load = () => {
  if (!dev) {
    throw redirect(307, '/dashboard');
  }
  return {};
};

export const _meta = {
  title: '项目代码',
  permission: 'dev:project-code:view',
  icon: 'tdesign:code',
  group: '开发模式',
  order: 200,
  hidden: !dev,
};
