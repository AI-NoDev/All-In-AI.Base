/**
 * 任务日志模块 Actions
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

import { jobLogGetByPagination } from './getByPagination';
import { jobLogGetByPk } from './getByPk';
import { jobLogCreate } from './create';
import { jobLogCreateMany } from './createMany';
import { jobLogUpdate } from './update';
import { jobLogUpdateMany } from './updateMany';
import { jobLogDeleteByPk } from './deleteByPk';
import { jobLogGetSchema } from './getSchema';

export const jobLogActions = [
  jobLogGetByPagination,
  jobLogGetByPk,
  jobLogCreate,
  jobLogCreateMany,
  jobLogUpdate,
  jobLogUpdateMany,
  jobLogDeleteByPk,
  jobLogGetSchema,
];
