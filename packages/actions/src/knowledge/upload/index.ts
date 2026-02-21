/**
 * 知识库文件上传 Actions
 */

export * from './schemas';
export { uploadGetUrl } from './getUrl';
export { uploadConfirm } from './confirm';
export { uploadDirect } from './direct';
export { uploadForce } from './force';

import { uploadGetUrl } from './getUrl';
import { uploadConfirm } from './confirm';
import { uploadDirect } from './direct';
import { uploadForce } from './force';

export const uploadActions = [
  uploadGetUrl,
  uploadConfirm,
  uploadDirect,
  uploadForce,
];
