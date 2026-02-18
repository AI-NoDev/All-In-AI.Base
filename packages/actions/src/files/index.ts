/**
 * 文件管理 Actions 入口
 * 
 * 模块拆分:
 * - utils.ts: 权限检查、文本文件检测等工具函数
 * - fileUpload.ts: 文件上传相关 (checkExists, upload, uploadForce, getUploadUrl, confirmUpload)
 * - fileContent.ts: 文件内容读取/保存 (getDownloadUrl, getTextContent, getContent, saveContent)
 * - fileOperations.ts: 文件操作 (copy, copyAsDuplicate, move, rename, delete, deleteMany, updateDescription)
 * - folderOperations.ts: 文件夹操作 (create, rename, updateStyle, updateDescription, updateOrder, delete, move)
 * - fileVersion.ts: 文件版本 (versionDownload, versionRestore)
 * - filePermission.ts: 文件权限 (Casbin 权限管理)
 * - fileShare.ts: 文件共享
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

// 导出文件上传 Actions
export {
  fileCheckExists,
  fileUpload,
  fileUploadForce,
  fileGetUploadUrl,
  fileConfirmUpload,
  fileUploadActions,
} from './fileUpload';

// 导出文件内容 Actions
export {
  fileGetDownloadUrl,
  fileGetTextContent,
  fileGetContent,
  fileSaveContent,
  fileContentActions,
} from './fileContent';

// 导出文件操作 Actions
export {
  fileCopy,
  fileCopyAsDuplicate,
  fileMove,
  fileRename,
  fileDelete,
  fileDeleteMany,
  fileUpdateDescription,
  fileOperationsActions,
} from './fileOperations';


// 导出文件夹操作 Actions
export {
  filesFolderCreate,
  filesFolderRename,
  filesFolderUpdateStyle,
  filesFolderUpdateDescription,
  filesFolderUpdateOrder,
  filesFolderDelete,
  filesFolderMove,
  folderOperationsActions,
} from './folderOperations';

// 导出文件版本 Actions
export {
  fileVersionDownload,
  fileVersionRestore,
  fileVersionActions,
} from './fileVersion';

// 导出文件权限 Actions
export { filePermissionActions } from './filePermission';

// 导出文件共享 Actions
export { fileShareActions } from './fileShare';

// 导出公开上传 Actions
export { publicUploadAvatar, publicUploadActions } from './publicUpload';

// 导出 AI 聊天附件上传 Actions
export { aiChatUploadAttachment, aiChatGetAttachmentUrl, aiChatUploadActions } from './aiChatUpload';

// 导入所有 actions 用于聚合导出
import { fileUploadActions } from './fileUpload';
import { fileContentActions } from './fileContent';
import { fileOperationsActions } from './fileOperations';
import { folderOperationsActions } from './folderOperations';
import { fileVersionActions } from './fileVersion';
import { filePermissionActions } from './filePermission';
import { fileShareActions } from './fileShare';
import { publicUploadActions } from './publicUpload';
import { aiChatUploadActions } from './aiChatUpload';

// ============ 导出所有 actions ============
export const filesActions = [
  ...fileUploadActions,
  ...fileContentActions,
  ...fileOperationsActions,
  ...folderOperationsActions,
  ...fileVersionActions,
  ...filePermissionActions,
  ...fileShareActions,
  ...publicUploadActions,
  ...aiChatUploadActions,
];
