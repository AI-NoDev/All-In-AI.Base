/**
 * 知识库模块 Actions 入口
 * 
 * 统一的知识库 API，使用 node 实体同时处理文件和文件夹
 * 
 * 模块结构:
 * - node/: REST CRUD 操作
 * - operations/: 快捷操作 (移动、复制、搜索等)
 * - upload/: 文件上传
 * - content/: 文件内容读写
 * - version/: 版本控制
 * - favorite/: 收藏功能
 * - share/: 共享查询
 * - permission/: 权限管理
 */

// 导出工具函数
export {
  checkNodePermission,
  assertNodePermission,
  buildPath,
  buildMaterializedPath,
  parseMaterializedPath,
  isAncestor,
  isTextFile,
  generateUniqueName,
  parseFileName,
  getPermissionAdapter,
  TEXT_FILE_EXTENSIONS,
  TEXT_MIME_PREFIXES,
} from './utils';

// 导出节点 CRUD Actions
export {
  nodeGetByPagination,
  nodeGetChildren,
  nodeGetByPk,
  nodeCreate,
  nodeUpdate,
  nodeDelete,
  nodeDeleteMany,
  nodeGetSchema,
  nodeActions,
} from './node';

// 导出快捷操作 Actions
export {
  nodeMove,
  nodeCopy,
  nodeCheckExists,
  nodeGetPath,
  nodeUpdateOrder,
  nodeSearch,
  operationsActions,
} from './operations';

// 导出上传 Actions
export {
  uploadGetUrl,
  uploadConfirm,
  uploadDirect,
  uploadForce,
  uploadActions,
} from './upload';

// 导出内容 Actions
export {
  contentGetDownloadUrl,
  contentGetText,
  contentGetRaw,
  contentActions,
} from './content';

// 导出版本 Actions
export {
  versionList,
  versionDownload,
  versionRestore,
  versionGetByPagination,
  versionGetSchema,
  versionActions,
} from './version';

// 导出收藏 Actions
export {
  favoriteAdd,
  favoriteRemove,
  favoriteCheck,
  favoriteList,
  favoriteActions,
} from './favorite';

// 导出共享查询 Actions
export {
  shareGetMyShared,
  shareGetSharedWithMe,
  shareActions,
} from './share';

// 导出权限管理 Actions
export {
  permissionGetForNode,
  permissionSetForNode,
  permissionAdd,
  permissionRemove,
  permissionGetEffective,
  permissionQuickShare,
  permissionRevokeShare,
  permissionActions,
} from './permission';

// 聚合所有 actions
import { nodeActions } from './node';
import { operationsActions } from './operations';
import { uploadActions } from './upload';
import { contentActions } from './content';
import { versionActions } from './version';
import { favoriteActions } from './favorite';
import { shareActions } from './share';
import { permissionActions } from './permission';

/** 知识库模块所有 Actions */
export const knowledgeActions = [
  ...nodeActions,
  ...operationsActions,
  ...uploadActions,
  ...contentActions,
  ...versionActions,
  ...favoriteActions,
  ...shareActions,
  ...permissionActions,
];
