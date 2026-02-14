/**
 * 导出所有 system 模块的 table 和 relations，供 drizzle-kit 迁移使用
 */
export { user } from './user';
export { config } from './config';
export { department } from './department';
export { dict } from './dict';
export { dictGroup } from './dictGroup';
export { job } from './job';
export { jobLog } from './jobLog';
export { loginInfo } from './loginInfo';
export { menu } from './menu';
export { notice } from './notice';
export { operationLog } from './operationLog';
export { post } from './post';
export { role } from './role';
export { roleDepartment } from './roleDepartment';
export { roleMenu } from './roleMenu';
export { token } from './token';
export { userPost } from './userPost';
export { userRole } from './userRole';

// Casbin permission tables
export { casbinRule } from './casbinRule';
export { permission } from './permission';

// Relations
export * from './relations';
