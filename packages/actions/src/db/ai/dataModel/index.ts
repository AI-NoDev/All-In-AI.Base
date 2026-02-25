/**
 * 数据模型模块
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

import { dataModelGetByPagination } from './getByPagination';
import { dataModelGetByPk } from './getByPk';
import { dataModelCreate } from './create';
import { dataModelCreateMany } from './createMany';
import { dataModelUpdate } from './update';
import { dataModelUpdateMany } from './updateMany';
import { dataModelDeleteByPk } from './deleteByPk';
import { dataModelGetSchema } from './getSchema';

export const dataModelActions = [
  dataModelGetByPagination,
  dataModelGetByPk,
  dataModelCreate,
  dataModelCreateMany,
  dataModelUpdate,
  dataModelUpdateMany,
  dataModelDeleteByPk,
  dataModelGetSchema,
];
