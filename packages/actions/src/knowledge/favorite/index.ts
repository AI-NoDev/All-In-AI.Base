/**
 * 知识库收藏 Actions
 */

export * from './schemas';
export { favoriteAdd } from './add';
export { favoriteRemove } from './remove';
export { favoriteCheck } from './check';
export { favoriteList } from './list';

import { favoriteAdd } from './add';
import { favoriteRemove } from './remove';
import { favoriteCheck } from './check';
import { favoriteList } from './list';

export const favoriteActions = [
  favoriteAdd,
  favoriteRemove,
  favoriteCheck,
  favoriteList,
];
