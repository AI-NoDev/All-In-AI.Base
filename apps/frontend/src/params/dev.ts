/**
 * 开发模式路由匹配器
 * 只在开发模式下匹配，生产模式返�?false�?04�?
 */
import { dev } from '$app/environment';

export function match(value: string): boolean {
  // 只在开发模式下，这个参数匹配器才返�?true
  return dev && value === 'dev';
}
