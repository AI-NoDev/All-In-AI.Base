import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3/MinIO 配置
const s3Config = {
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // MinIO 需要
};

export const s3Client = new S3Client(s3Config);

export const DEFAULT_BUCKET = process.env.S3_BUCKET || 'knowledge';

export interface UploadResult {
  key: string;
  bucket: string;
  etag: string | undefined;
  versionId: string | undefined;
}

export interface PresignedUrlResult {
  url: string;
  expiresAt: Date;
}

// 上传文件
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
  bucket: string = DEFAULT_BUCKET,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  const result = await s3Client.send(command);

  return {
    key,
    bucket,
    etag: result.ETag?.replace(/"/g, ''),
    versionId: result.VersionId,
  };
}

// 获取文件
export async function getFile(key: string, bucket: string = DEFAULT_BUCKET): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const result = await s3Client.send(command);
  const bodyContents = await result.Body?.transformToByteArray();
  
  if (!bodyContents) {
    throw new Error('File not found');
  }

  return Buffer.from(bodyContents);
}

// 获取文件内容为字符串
export async function getFileAsString(key: string, bucket: string = DEFAULT_BUCKET): Promise<string> {
  const buffer = await getFile(key, bucket);
  return buffer.toString('utf-8');
}

// 删除文件
export async function deleteFile(key: string, bucket: string = DEFAULT_BUCKET): Promise<boolean> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
  return true;
}

// 复制文件
export async function copyFile(
  sourceKey: string,
  destKey: string,
  sourceBucket: string = DEFAULT_BUCKET,
  destBucket: string = DEFAULT_BUCKET
): Promise<UploadResult> {
  const command = new CopyObjectCommand({
    Bucket: destBucket,
    Key: destKey,
    CopySource: `${sourceBucket}/${sourceKey}`,
  });

  const result = await s3Client.send(command);

  return {
    key: destKey,
    bucket: destBucket,
    etag: result.CopyObjectResult?.ETag?.replace(/"/g, ''),
    versionId: result.VersionId,
  };
}

// 移动文件（复制后删除）
export async function moveFile(
  sourceKey: string,
  destKey: string,
  sourceBucket: string = DEFAULT_BUCKET,
  destBucket: string = DEFAULT_BUCKET
): Promise<UploadResult> {
  const result = await copyFile(sourceKey, destKey, sourceBucket, destBucket);
  await deleteFile(sourceKey, sourceBucket);
  return result;
}

// 检查文件是否存在
export async function fileExists(key: string, bucket: string = DEFAULT_BUCKET): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

// 获取预签名上传 URL
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  bucket: string = DEFAULT_BUCKET,
  expiresIn: number = 3600
): Promise<PresignedUrlResult> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  return { url, expiresAt };
}

// 获取预签名下载 URL
export async function getPresignedDownloadUrl(
  key: string,
  bucket: string = DEFAULT_BUCKET,
  expiresIn: number = 3600,
  filename?: string
): Promise<PresignedUrlResult> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: filename ? `attachment; filename="${encodeURIComponent(filename)}"` : undefined,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  return { url, expiresAt };
}

// 生成存储 key: /userId/folderId/timestamp-random-filename
export function generateStorageKey(userId: string, folderId: string | null, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const folderPath = folderId || 'root';
  return `${userId}/${folderPath}/${timestamp}-${random}-${filename}`;
}

// 生成文件夹路径 key: /userId/folderId/
export function generateFolderKey(userId: string, folderId: string): string {
  return `${userId}/${folderId}/`;
}
