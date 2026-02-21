/**
 * 知识库文件内容读写 Actions
 */

export * from './schemas';
export { contentGetDownloadUrl } from './getDownloadUrl';
export { contentGetText } from './getText';
export { contentSaveText } from './saveText';
export { contentGetRaw } from './getRaw';

import { contentGetDownloadUrl } from './getDownloadUrl';
import { contentGetText } from './getText';
import { contentSaveText } from './saveText';
import { contentGetRaw } from './getRaw';

export const contentActions = [
  contentGetDownloadUrl,
  contentGetText,
  contentSaveText,
  contentGetRaw,
];
