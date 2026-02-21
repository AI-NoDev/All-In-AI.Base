/**
 * 知识库文件版本 Actions（仅文件类型节点）
 */

export * from './schemas';
export { versionList } from './list';
export { versionDownload } from './download';
export { versionRestore } from './restore';
export { versionGetByPagination } from './getByPagination';
export { versionGetSchema } from './getSchema';

import { versionList } from './list';
import { versionDownload } from './download';
import { versionRestore } from './restore';
import { versionGetByPagination } from './getByPagination';
import { versionGetSchema } from './getSchema';

export const versionActions = [
  versionList,
  versionDownload,
  versionRestore,
  versionGetByPagination,
  versionGetSchema,
];
