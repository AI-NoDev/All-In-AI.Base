/**
 * 文件管理 Actions 入口
 * 
 * 注意: 知识库相关操作已迁移到 knowledge/ 模块
 * 此模块仅保留:
 * - publicUpload: 公开上传 (头像等)
 * - aiChatUpload: AI 聊天附件上传
 * - utils: 工具函数
 */

// 导出工具函数
export {
  checkResourcePermission,
  assertResourcePermission,
  isTextFile,
  escapeRegExp,
  TEXT_FILE_EXTENSIONS,
  TEXT_MIME_PREFIXES,
  type ResourceType,
  type PermissionType,
  type ResourceRecord,
} from './utils';

// 导出公开上传 Actions
export { publicUploadAvatar, publicUploadActions } from './publicUpload';

// 导出 AI 聊天附件上传 Actions
export { aiChatUploadAttachment, aiChatGetAttachmentUrl, aiChatUploadActions } from './aiChatUpload';

// 聚合所有 actions
import { publicUploadActions } from './publicUpload';
import { aiChatUploadActions } from './aiChatUpload';

/** 文件模块所有 Actions (仅公开上传和AI聊天上传) */
export const filesActions = [
  ...publicUploadActions,
  ...aiChatUploadActions,
];
