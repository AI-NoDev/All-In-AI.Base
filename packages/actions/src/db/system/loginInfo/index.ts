/**
 * 登录日志模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './deleteByPk';
export * from './getSchema';

import { loginInfoGetByPagination } from './getByPagination';
import { loginInfoGetByPk } from './getByPk';
import { loginInfoCreate } from './create';
import { loginInfoDeleteByPk } from './deleteByPk';
import { loginInfoGetSchema } from './getSchema';

export const loginInfoActions = [
  loginInfoGetByPagination,
  loginInfoGetByPk,
  loginInfoCreate,
  loginInfoDeleteByPk,
  loginInfoGetSchema,
];
