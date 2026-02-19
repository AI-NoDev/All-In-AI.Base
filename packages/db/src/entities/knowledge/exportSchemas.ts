/**
 * 导出所有 knowledge 模块的 table 和 relations，供 drizzle-kit 迁移使用
 */
export { node } from './node';
export { nodeVersion } from './nodeVersion';
export { favorite } from './favorite';

// Relations
export * from './relations';
