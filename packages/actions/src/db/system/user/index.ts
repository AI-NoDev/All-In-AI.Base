/**
 * 用户模块 Actions
 */

// 导出各个 action
export { userGetByPagination } from './getByPagination';
export { userGetByPk } from './getByPk';
export { userCreate } from './create';
export { userCreateMany } from './createMany';
export { userUpdate } from './update';
export { userUpdateMany } from './updateMany';
export { userDeleteByPk } from './deleteByPk';
export { userGetSchema } from './getSchema';
export { userResetPassword } from './resetPassword';

// 导出工具函数和类型
export * from './utils';
export * from './schemas';

// 导入所有 actions 用于注册
import { userGetByPagination } from './getByPagination';
import { userGetByPk } from './getByPk';
import { userCreate } from './create';
import { userCreateMany } from './createMany';
import { userUpdate } from './update';
import { userUpdateMany } from './updateMany';
import { userDeleteByPk } from './deleteByPk';
import { userGetSchema } from './getSchema';
import { userResetPassword } from './resetPassword';

/** 用户模块所有 Actions */
export const userActions = [
  userGetByPagination,
  userGetByPk,
  userCreate,
  userCreateMany,
  userUpdate,
  userUpdateMany,
  userDeleteByPk,
  userGetSchema,
  userResetPassword,
];
