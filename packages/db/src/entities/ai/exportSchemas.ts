/**
 * 导出所有 ai 模块的 table 和 relations，供 drizzle-kit 迁移使用
 */
export { agent } from './agent';
export { agentSession } from './agentSession';
export { agentMessage } from './agentMessage';
export { model } from './model';
export { provider } from './provider';
export { skill } from './skill';
export { tool } from './tool';
export { toolGroup } from './toolGroup';

// Relations
export * from './relations';
