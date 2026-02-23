/**
 * 定时任务模块 Actions
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './update';
export * from './updateMany';
export * from './deleteByPk';
export * from './getSchema';

import { jobGetByPagination } from './getByPagination';
import { jobGetByPk } from './getByPk';
import { jobCreate } from './create';
import { jobCreateMany } from './createMany';
import { jobUpdate } from './update';
import { jobUpdateMany } from './updateMany';
import { jobDeleteByPk } from './deleteByPk';
import { jobGetSchema } from './getSchema';

export const jobActions = [
  jobGetByPagination,
  jobGetByPk,
  jobCreate,
  jobCreateMany,
  jobUpdate,
  jobUpdateMany,
  jobDeleteByPk,
  jobGetSchema,
];
