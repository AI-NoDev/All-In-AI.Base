/**
 * 知识库共享查询 Actions
 */

export * from './schemas';
export { shareGetMyShared } from './getMyShared';
export { shareGetSharedWithMe } from './getSharedWithMe';

import { shareGetMyShared } from './getMyShared';
import { shareGetSharedWithMe } from './getSharedWithMe';

export const shareActions = [
  shareGetMyShared,
  shareGetSharedWithMe,
];
