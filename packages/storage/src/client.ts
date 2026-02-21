/**
 * S3/MinIO 客户端管理
 * 单例模式
 */

import { S3Client } from '@aws-sdk/client-s3';

export type StorageClient = S3Client;

let storageClient: StorageClient | null = null;

/**
 * 获取存储配置
 */
function getStorageConfig() {
  return {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin123',
    },
    forcePathStyle: true, // MinIO 需要
  };
}

/**
 * 获取 S3 客户端单例
 */
export function getStorageClient(): StorageClient {
  if (!storageClient) {
    const config = getStorageConfig();
    storageClient = new S3Client(config);
  }
  return storageClient;
}

/**
 * 关闭存储客户端
 */
export function closeStorageClient(): void {
  if (storageClient) {
    storageClient.destroy();
    storageClient = null;
  }
}
