/**
 * Storage 包入口
 * 提供 S3/MinIO 文件存储功能
 */

export {
  getStorageClient,
  closeStorageClient,
  type StorageClient,
} from './client';

export {
  uploadFile,
  getFile,
  getFileAsString,
  deleteFile,
  copyFile,
  moveFile,
  fileExists,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  getPresignedDownloadUrlForDownload,
  generateStorageKey,
  generateFolderKey,
  DEFAULT_BUCKET,
  type UploadResult,
  type PresignedUrlResult,
} from './operations';
