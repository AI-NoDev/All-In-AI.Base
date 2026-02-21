/**
 * 部门模块 Actions
 */

// 导出各个 action
export { departmentGetByPagination } from './getByPagination';
export { departmentGetByPk } from './getByPk';
export { departmentCreate } from './create';
export { departmentCreateMany } from './createMany';
export { departmentUpdate } from './update';
export { departmentUpdateMany } from './updateMany';
export { departmentDeleteByPk } from './deleteByPk';
export { departmentGetSchema } from './getSchema';

// 导出工具函数和类型
export * from './utils';
export * from './schemas';

// 导入所有 actions 用于注册
import { departmentGetByPagination } from './getByPagination';
import { departmentGetByPk } from './getByPk';
import { departmentCreate } from './create';
import { departmentCreateMany } from './createMany';
import { departmentUpdate } from './update';
import { departmentUpdateMany } from './updateMany';
import { departmentDeleteByPk } from './deleteByPk';
import { departmentGetSchema } from './getSchema';

/** 部门模块所有 Actions */
export const departmentActions = [
  departmentGetByPagination,
  departmentGetByPk,
  departmentCreate,
  departmentCreateMany,
  departmentUpdate,
  departmentUpdateMany,
  departmentDeleteByPk,
  departmentGetSchema,
];
