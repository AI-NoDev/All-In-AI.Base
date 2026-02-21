/**
 * 知识库节点操作 Actions
 * 快捷操作：移动、复制、检查存在等
 */

export * from './schemas';
export { nodeMove } from './move';
export { nodeCopy } from './copy';
export { nodeCheckExists } from './checkExists';
export { nodeGetPath } from './getPath';
export { nodeUpdateOrder } from './updateOrder';
export { nodeSearch } from './search';

import { nodeMove } from './move';
import { nodeCopy } from './copy';
import { nodeCheckExists } from './checkExists';
import { nodeGetPath } from './getPath';
import { nodeUpdateOrder } from './updateOrder';
import { nodeSearch } from './search';

export const operationsActions = [
  nodeMove,
  nodeCopy,
  nodeCheckExists,
  nodeGetPath,
  nodeUpdateOrder,
  nodeSearch,
];
